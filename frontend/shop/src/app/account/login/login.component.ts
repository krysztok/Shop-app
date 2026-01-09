import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { CartService } from '../../cart/cart.service';
import { WishListService } from '../../wish-list/wish-list.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private cartService: CartService, private wishListService: WishListService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
    })
  }

  login() {
    sessionStorage.removeItem("app.token");

    this.authService.login(this.loginForm.get("email")?.value, this.loginForm.get("password")?.value)
      .subscribe({
        next: (token) => {
          sessionStorage.setItem("app.token", token);

          const decodedToken = jwtDecode<JwtPayload>(token);
          // @ts-ignore
          sessionStorage.setItem("app.roles", decodedToken.scope);

          this.cartService.changeUser();
          this.wishListService.changeUser();
          this.router.navigateByUrl("/");
        },
        error: (error) => console.log(error)
      });
  }

  register() {
    this.router.navigate(['register'], {});
  }

}
