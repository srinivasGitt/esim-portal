import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';

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
          if (url.includes('loyalty-point-program') || url.includes('coupon-management'))
            this.checkFeatureAccess();
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
  checkFeatureAccess(): boolean {
    const clientConfig = JSON.parse(this._localStorageService.getCacheConfig()!);

    if (clientConfig?.rewardPointsMasterEnabled) {
      return true;
    }

    if (clientConfig?.couponCodesMasterEnabled) {
      return true;
    }

    this._router.navigate(['/']);
    return false;
  }
}
