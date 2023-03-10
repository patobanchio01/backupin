import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl: string = "/api/prodis/v1/busDin";

  constructor(
    private _http: HttpClient,
  ) { }

  public search(params : any) {
    let auxEndpoint = this.baseUrl + '/find';
    let body = params;
    return this._http.post(auxEndpoint, body);
  }
}