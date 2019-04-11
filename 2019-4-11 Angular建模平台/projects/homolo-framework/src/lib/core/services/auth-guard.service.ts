import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { UserService } from '../../usersystem/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLogin();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLogin();
  }

  /**
   * 判断用户是否登录，没有登录进行跳转
   */
  isUserLogin(): boolean {
    if (this.userService.currentUser == null || this.userService.currentUser.anonymous) {
        console.log('user not login, redirect to login.');
        this.router.navigateByUrl('/login');
        return false;
    }
    return true;
  }
}
