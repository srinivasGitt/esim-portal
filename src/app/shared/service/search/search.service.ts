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


  getSearchResult(url: string, searchTerm: string, itemsPerPage?: number, currentPage?: number): Observable<any> {
    this.searchedTerm = searchTerm

    if(url.includes('inventory')) {
      url = '/inventories'
    }

    if(url.includes('setting')) {
      url = '/customers/setting'
    }

    if(searchTerm && searchTerm.length > 3) {
      if(itemsPerPage && currentPage) {
        return this.http.get(`${this.serverUrl}${url}/search?q=${searchTerm}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`);
      }
      else {
        return this.http.get(`${this.serverUrl}${url}/search?q=${searchTerm}`);
      }
    }
    else {
      return this.http.get(`${this.serverUrl}${url}`);
    }
  }

  getResults(){
    return this._searchResults$.asObservable();
  }

  setResults(results : any){
    this._searchResults$.next(results);
  }
}
