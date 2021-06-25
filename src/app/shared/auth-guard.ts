import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate ,CanActivateChild} from '@angular/router';
  /**
   * 路由守卫
   */
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild{

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('认证通过，授予访问权');
    return true;
  }
  
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log('全局拦截子路由');
    return true;
  }

}