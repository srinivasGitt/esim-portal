import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  serverUrl = environment.serverUrl;
  _searchResults$ = new BehaviorSubject<any>(undefined);
  searchedTerm: string = ''

  constructor(private http: HttpClient) { }


  // getSearchResult(url: string, searchTerm: string, itemsPerPage?: number, currentPage?: number): Observable<any> {
  //   this.searchedTerm = searchTerm
  //   var finalURL = ''

  //   if(url.includes('inventory')) {
  //     url = '/inventories'
  //   }

  //   if(url.includes('setting')) {
  //     url = '/customers/setting'
  //   }

  //   if(url.includes('coupon-management')) {
  //     url = '/couponCode'
  //   }

  //   if(url.includes('support') || url.includes('contactus')) {
  //     if(url.includes('support')) {
  //       url = '/support-request'
  //       finalURL = `${this.serverUrl}${url}?type=support&q=${searchTerm}`
  //     }

  //     if(url.includes('contactus')) {
  //       url = '/support-request'
  //       finalURL = `${this.serverUrl}${url}?type=contact&q=${searchTerm}`
  //     }
  //   }

  //   else {
  //     finalURL = `${this.serverUrl}${url}/search?q=${searchTerm}`
  //   }


  //   if(searchTerm && searchTerm.length > 3) {
  //     if(itemsPerPage && currentPage) {
  //       return this.http.get(`${finalURL}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
  //     }
  //     else {
  //       return this.http.get(`${finalURL}`);
  //     }
  //   }

  //   else {
  //     return this.http.get(`${this.serverUrl}${url}`);
  //   }
  // }

  getSearchResult(
    url: string,
    searchTerm: string,
    itemsPerPage?: number,
    currentPage?: number
  ): Observable<any> {
    let finalURL = '';
    let type = '';
    this.searchedTerm = searchTerm;
    if (url.includes('inventory')) {
      url = '/inventories';
    } else if (url.includes('setting')) {
      url = '/customers/setting';
    } else if (url.includes('coupon-management')) {
      url = '/couponCode';
    } else if (url.includes('support') || url.includes('contactus')) {
      type = url.includes('support') ? 'support' : 'contact';
      finalURL = `${this.serverUrl}/support-request?type=${type}`;
    } else {
      finalURL = `${this.serverUrl}${url}`;
    }

    if (searchTerm && searchTerm.length > 2) {
      type ? (finalURL += `&q=${searchTerm}`) : (finalURL += `/search?q=${searchTerm}`);
      if (itemsPerPage && currentPage) {
        finalURL += `&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`;
      }
    }

    return this.http.get(finalURL);
  }

  getResults(){
    return this._searchResults$.asObservable();
  }

  setResults(results : any){
    this._searchResults$.next(results);
  }
}
