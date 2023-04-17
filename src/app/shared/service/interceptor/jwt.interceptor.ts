import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private _localStorageService: LocalStorageService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const token = this._localStorageService.getToken()
    const isApiUrl = request.url.startsWith(environment.serverUrl)

    if(token && isApiUrl) {
      
      if(request.url.includes("inventory")) {
        
        request = request.clone({
          setHeaders: {
            Accept: 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
          }
        })  
      }
      else {
        request = request.clone({
          setHeaders: {
            Accept: 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })          
      }
      
    }

    return next.handle(request).pipe(map(data => data), 
    catchError((err: HttpErrorResponse) => {
      console.log(err)
        if(err.status === 401) {
          
          this.router.navigate(['/signin'])
        }

        return throwError(() => err)
      })
    );
  }
}
