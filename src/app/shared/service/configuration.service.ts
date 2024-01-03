import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  
  getConfigurationSetting(cacheId?: string) {
    var configurationUrl: string;

    if(cacheId) {
      configurationUrl = `customers/setting/configuration?cacheId=${cacheId}`
    } else {
      configurationUrl =`customers/setting/configuration`
    }
    return this.http.get(`${this.serverUrl}/${configurationUrl}`);
  }
}
