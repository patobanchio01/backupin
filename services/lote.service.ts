import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {


  private baseUrl = '/api/prodis/v1/lotes';

  constructor(private _http: HttpClient) { }

  public getLotes(params: any): Observable<any> {
    let auxEndpoint = this.baseUrl + '/farmacia/find';
    let body = params;
    return this._http.post(auxEndpoint, body);
  }

  
}
