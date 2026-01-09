import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AccountGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isLoggedIn() && (this.authService.isUserInRole("ROLE_CLIENT") || this.authService.isUserInRole("ROLE_ADMIN"))) {
            return true;
        } else {
            this.router.navigateByUrl("/login");
            return false;
        }
    }
}