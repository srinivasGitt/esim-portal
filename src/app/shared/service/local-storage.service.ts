import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN = 'authToken';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private _router: Router) { }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN, token);
  }

  removeToken() {
    localStorage.removeItem(TOKEN);
    this._router.navigate(['/signin']);
  }

  setTheme(isDarkTheme: boolean) {
    localStorage.setItem('screenMode', isDarkTheme ? 'dark' : 'light');
  }

  setCurrency(value: string) {
    localStorage.setItem('currency', value);
  }

  getCurrency() {
    return localStorage.getItem('currency');
  }

  clearStorage() {
    localStorage.clear();
    this._router.navigate(['/signin']);
  }

}
