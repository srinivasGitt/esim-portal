import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { SidebarService } from '../sidebar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _localStorageService: LocalStorageService,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this._localStorageService.getToken();
    const url: string = state.url;

    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));

      const check = tokenDecode.user.roles;
      
      if (tokenDecode.user.currency) {
        this._localStorageService.setCurrency(tokenDecode.user.currency);
      } else {
        this._localStorageService.setCurrency('USD');
      }

      if (
        (check.includes('superAdmin') || check.includes('admin')) &&
        !this._tokenExpiration(tokenDecode.exp)
      ) {
        if (check.includes('admin')) {
          if (url.includes('loyalty-point-program') || url.includes('coupon-management')) {
            this.checkFeatureAccess(route, url);
          }
          return true;
        }
      }
      return true;
    }

    this._router.navigate(['/signin']);
    return false;
  }

  // token expiration
  private _tokenExpiration(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }

  // Feature Access
  checkFeatureAccess(route: ActivatedRouteSnapshot, url: any): boolean {
    const clientConfig = JSON.parse(this._localStorageService.getCacheConfig()!);

    if (clientConfig?.rewardPointsMasterEnabled) {
      if (
        url.includes('loyalty-point-program') &&
        route.data?.['rewardPointsMasterEnabled'] &&
        route.data?.['rewardPointsMasterEnabled'] !== clientConfig?.rewardPointsMasterEnabled
      ) {
        return false;
      }

      if (
        url.includes('coupon-management') &&
        route.data?.['couponCodesMasterEnabled'] &&
        route.data?.['couponCodesMasterEnabled'] !== clientConfig?.couponCodesMasterEnabled
      ) {
        return false;
      }
      return true;
    }

    this._router.navigate(['/']);
    return false;
  }

}

@Injectable()
export class Permissions {

  constructor(private sidebarService: SidebarService,
    private _router: Router) {}

  canAccess(user: any, route: Route, segments: UrlSegment[]): boolean {
    console.log(user);
    console.log(route);
    console.log(segments);

    const tokenDecode = JSON.parse(atob(user.split('.')[1]));
    const check = tokenDecode.user.roles;

    const menuList = this.sidebarService.getSideBarMenus(check);
    const routePath = route.path?.toString();
    if(routePath && menuList.findIndex(ele => ele.link.includes(routePath)) > -1) {
      console.log('exist');
    } else {
      console.log('not exist');
      this._router.navigate(['page-not-found']);
    }

    return true;
  }
}

@Injectable()
export class CanMatchRoute implements CanMatch {
  constructor(private permissions: Permissions, 
    private _localStorageService: LocalStorageService,
    private _router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean>|Promise<boolean>|boolean {
    const token = this._localStorageService.getToken()!;

    if(token) {
      return this.permissions.canAccess(token, route, segments);
    }

    this._router.navigate(['/']);
    return false;
  } 
}
