import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { WishListService } from '../wish-list/wish-list.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem("app.token") != null;
  }

  login(username: string, password: string): Observable<string> {
    const httpOptions = {
      headers: {
        Authorization: 'Basic ' + window.btoa(username + ':' + password)
      },
      responseType: 'text' as 'text',
    };
    return this.http.post("http://localhost:8080/auth/p/login", null, httpOptions);
  }

  logout() {
    sessionStorage.removeItem("app.token");
    sessionStorage.removeItem("app.roles");
  }

  isAdmin() {
    if (sessionStorage.getItem("app.roles")) {
      return this.isUserInRole("ROLE_ADMIN")
    }
    return false;
  }

  isUserInRole(roleFromRoute: string) {
    const roles = sessionStorage.getItem("app.roles");

    if (roles!.includes(",")) {
      if (roles === roleFromRoute) {
        return true;
      }
    } else {
      const roleArray = roles!.split(",");
      for (let role of roleArray) {
        if (role === roleFromRoute) {
          return true;
        }
      }
    }
    return false;
  }
}
