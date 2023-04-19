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


  constructor(private http: HttpClient) { }


  getSearchResult(url: string, searchTerm: string): Observable<any> {
    console.log(url,searchTerm)
    if(url.includes('inventory')) {
      url = '/inventories'
    }
    return this.http.get(`${this.serverUrl}${url}/search?q=${searchTerm}`);
  }

  getResults(){
    return this._searchResults$.asObservable();
  }

  setResults(results : any){
    this._searchResults$.next(results);
  }
}
