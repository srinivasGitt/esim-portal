import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  serverUrl = environment.serverUrl;
  constructor(private http : HttpClient) { }

  getHeader() {
    const authToken = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: '*/*',
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      })
    };
    return httpOptions;
  }

  onUpload(file: any):Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name)
    console.log(file)
    return this.http.post(`${this.serverUrl}/inventory/import`, formData, this.getHeader())
  }
}
