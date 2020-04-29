import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "@/_models";
import { Users } from "@/_models/users";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Users>(`${config.apiUrl}/users/users`);
  }

  register(user: User) {
    return this.http.post(`${config.apiUrl}/auth/register`, user);
  }

  delete(id: number) {
    return this.http.delete(`${config.apiUrl}/users/${id}`);
  }

  update(user: User) {
    return this.http.put(`${config.apiUrl}/auth/update`, user);
  }
}
