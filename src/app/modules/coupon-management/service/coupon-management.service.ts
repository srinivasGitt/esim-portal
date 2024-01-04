import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponManagementService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  getCouponList(itemsPerPage?: number, currentPage?: number) {
    if (itemsPerPage && currentPage) {
      return this.http.get(
        `${this.serverUrl}/couponCode?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`
      );
    }
    return this.http.get(`${this.serverUrl}/couponCode`);
  }

  playAndPauseCoupon(coupon: any, isActive: boolean) {
    const id = coupon?._id;
    return this.http.put(`${this.serverUrl}/couponCode/${id}`, {
      isActive: isActive,
    });
  }
}
