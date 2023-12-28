import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoyaltyPointsWidgetResponse } from 'src/app/modules/loyalty-point-program/models/loyalty-points-widget-response.model';
import { environment } from 'src/environments/environment';
import { ClientConfig } from '../models/client-config.model';

@Injectable({
  providedIn: 'root',
})
export class LoyaltyService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) {}

  loyaltyPoints(loyaltyData: ClientConfig) {
    return this.http.put(`${this.serverUrl}/customers/setting/configuration`, loyaltyData);
  }

  getLoyaltyWidgets() {
    return this.http.get<ILoyaltyPointsWidgetResponse>(`${this.serverUrl}/loyalty-points/report`);
  }
}
