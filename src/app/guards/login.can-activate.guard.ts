import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
    providedIn: 'root',
})
export class LoginCanActivateGuard implements CanActivate {

    constructor(
        private loginService: LoginService,
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return (!this.loginService.session.loggedIn);
    }
}
