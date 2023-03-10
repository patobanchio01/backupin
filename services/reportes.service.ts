import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private baseUrl: string = "/api/prodis/v1/reportes";

  constructor(
    private _http: HttpClient,
  ) { }

  public getUrlReport(): Observable<any> {
    //Security token will be injected by http interceptor
    let auxEndpoint = this.baseUrl + '/url/findByPk';
    return this._http.get(auxEndpoint);
  }

  public getReportesActivos(): Observable<any> {
    //Security token will be injected by http interceptor
    let auxEndpoint = this.baseUrl + '/activos/find';
    return this._http.get(auxEndpoint);
  }

  public getConfigReporte(reportName: string): Observable<any> {
    //Security token will be injected by http interceptor
    let auxEndpoint = this.baseUrl + '/configuracion/find?flgActivo=S&jobName=' + reportName;
    return this._http.get(auxEndpoint);
  }

  public getHistorialReportes(codUsr: string): Observable<any> {
    //Security token will be injected by http interceptor
    let auxEndpoint = this.baseUrl + '/history/find?codUsr=' + localStorage.getItem('userName');
    return this._http.get(auxEndpoint);
  }

  public validarEjecucionReporte(params: any): Observable<any> {
    //Security token will be injected by http interceptor
    let auxEndpoint = this.baseUrl + '/ejecucion/validate';
    let body = params;
    return this._http.post(auxEndpoint, body);
  }
}
