import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

import { Auth, User } from "@/_models";
import { UserService, AuthenticationService, AlertService } from "@/_services";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Users } from "@/_models/users";

@Component({
  selector: "app-root",
  templateUrl: "home.component.html",
})
export class HomeComponent implements OnInit {
  updateForm: FormGroup;
  closeResult = "";
  currentUser: Auth;
  users: Users;
  isEdit: boolean = false;
  numberEditedColumn: number;
  modalUser: User;
  loading = false;
  submitted = false;
  deleteUsername: string;
  deleteEmail: string;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.updateForm.controls;
  }

  open(content) {}

  editUser(rowKey: number, content) {
    this.isEdit = true;
    this.numberEditedColumn = rowKey;
    this.modalUser = this.users.data[rowKey];

    this.updateForm = this.formBuilder.group({
      username: [this.modalUser.username, Validators.required],
      email: [
        this.modalUser.email,
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      phone: [this.modalUser.phone, Validators.required],
      skillsets: [this.modalUser.skillsets, Validators.required],
      hobby: [this.modalUser.hobby, Validators.required],
    });
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  openDeleteModal(username: string, email: string, modaldelete) {
    this.deleteUsername = username;
    this.deleteEmail = email;
    this.modalService.open(modaldelete, {
      ariaLabelledBy: "modal-basic-title",
    });
  }

  deleteUser() {
    console.log("test");

    this.loading = true;
    this.userService
      .delete(this.deleteEmail)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loading = false;
          this.alertService.success(
            `User has been deleted ${this.deleteUsername}`,
            true
          );
          this.loadAllUsers();
          this.modalService.dismissAll();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
          this.modalService.dismissAll();
        }
      );
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .update(this.updateForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success("Update successful", true);
          this.modalService.dismissAll();
          this.loadAllUsers();
          this.loading = false;
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
          this.modalService.dismissAll();
        }
      );
  }

  private loadAllUsers() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe((users: Users) => {
        this.users = users;
      });
  }
}
