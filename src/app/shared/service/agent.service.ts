import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  inviteAgent(agentDetails: any) {
    return this.http.post(`${this.serverUrl}/agents/invite`, agentDetails);
  }
}
