import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  serverUrl = environment.serverUrl;
  constructor(private http : HttpClient) { }

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
  
  getFileHeader() {
    const authToken = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${authToken}`,
        // 'Content-Type': 'multipart/form-data',
      }),
      reportProgress: true,
      observe: "events" as 'body'
    };
    return httpOptions;
  }
  */

  onUpload(file: any):Observable<any> {
    const formData = new FormData();
    formData.append("file", file)
    // return this.http.post(`${this.serverUrl}/inventory/import`, formData, getFileHeader())
    return this.http.post(`${this.serverUrl}/inventory/import`, formData, { reportProgress: true, observe: "events" as 'body' })
  }
}
