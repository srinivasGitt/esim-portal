import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  serverUrl = environment.serverUrl;
  private _currentUser$ = new BehaviorSubject<any>(undefined);
  private _userRoles$ = new BehaviorSubject<Array<string>>([]);
  inProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {}

  /*
  ************************************
  Commented to check with interceptor
  ************************************
  getHeader() {
    const authToken = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      })
    };
    return httpOptions;
  }

  // signin(userData: any) {
  //   return this.http.post(`${this.serverUrl}/auth/signin`, userData);
  // }
  // signup(userData: any) {
  //   return this.http.post(`${this.serverUrl}/auth/signin`, userData);
  // }

  getUserDetails(){
    return this.http.get(`${this.serverUrl}/users/me`, this.getHeader());
  }

  getCurrentUser(){
    return this._currentUser$.asObservable();
  }

  setCurrentUser(userDetails : any){
    this._currentUser$.next(userDetails);
  }

  changeCurrentCustomer( data:any){
    return this.http.post(`${this.serverUrl}/users/change-customer`, data, this.getHeader());
  }

  setDefaultCustomer(){
    return this.http.get(`${this.serverUrl}/users/set-default-customer`, this.getHeader());
  }

  createUsers(data: any) {
    return this.http.post(`${this.serverUrl}/users/invite-user`, data, this.getHeader());
  }

  getAllUsers(custId: any) {
    if(custId) {
      return this.http.get(`${this.serverUrl}/users?customerId=${custId}`, this.getHeader());
    } else {
      return this.http.get(`${this.serverUrl}/users`, this.getHeader());
    }

  }

  updateUser(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/users/${id}`, data, this.getHeader());
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.serverUrl}/users/${id}`, this.getHeader());
  }

  // Invite User
  inviteUser(data:any){
    return this.http.post(`${this.serverUrl}/users/invite-user`, data, this.getHeader());
  }

  */

  getUserDetails() {
    return this.http.get(`${this.serverUrl}/users/me`);
  }

  getCurrentUser() {
    return this._currentUser$.asObservable();
  }

  setCurrentUser(userDetails: any) {
    this._userRoles$.next(userDetails?.roles || []);
    this._currentUser$.next(userDetails);
  }

  validateUserRole(){
    return this._userRoles$.asObservable();
  }
  changeCurrentCustomer(data: any) {
    return this.http.post(`${this.serverUrl}/users/change-customer`, data);
  }

  setDefaultCustomer() {
    return this.http.get(`${this.serverUrl}/users/set-default-customer`);
  }

  createUsers(data: any) {
    return this.http.post(`${this.serverUrl}/users/invite-user`, data);
  }

  getAllUsers(custId: any, itemsPerPage?: number, currentPage?: number) {
    if (itemsPerPage && currentPage) {
      return this.http.get(
        `${this.serverUrl}/users?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`
      );
    } else if (custId) {
      return this.http.get(`${this.serverUrl}/users?customerId=${custId}`);
    } else {
      return this.http.get(`${this.serverUrl}/users`);
    }
  }

  updateUser(id: any, data: any) {
    return this.http.put(`${this.serverUrl}/users/${id}`, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.serverUrl}/users/${id}`);
  }

  // Invite User
  inviteUser(data: any) {
    return this.http.post(`${this.serverUrl}/users/invite-user`, data);
  }
}
