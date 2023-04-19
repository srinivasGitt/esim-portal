import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _localStorageService: LocalStorageService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = this._localStorageService.getToken();

    if(token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      const check = tokenDecode.user.roles;

      if((check.includes('superAdmin') || check.includes('admin')) && !this._tokenExpiration(tokenDecode.exp)) 
      return true;
    }

    this._router.navigate(['/signin']);
    return false;
  }
  
  // token expiration
  private _tokenExpiration(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration
  }
}
