import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColaProcesosService {
  private baseUrl: string = "/api/prodis/v1/colaProcesos";

  constructor(private _http: HttpClient) { }

  public relaunchProcess(nroPrc: number): Observable<any> {
    let auxEndpoint = this.baseUrl + '/relaunch?nroPrc=' + nroPrc;
    return this._http.put(auxEndpoint, null);
  }

  public findHistorial(tipPrc: string, flgEstado: string, fecDesde: string, fecHasta: string, codUsr?: string): Observable<any> {
    let auxEndpoint = this.baseUrl + '/historial/find';

    // Formateo las fechas en el formato correcto.
    let fechaDesdeAux = new Date(fecDesde);
    let fechaHastaAux = new Date(fecHasta);

    let body = {
      "codUsr": codUsr,
      "tipPrc": tipPrc,
      "flgEstado": flgEstado,
      "fecDesde": fecDesde ? (fechaDesdeAux.getDate() + 1) + "/" + (fechaDesdeAux.getMonth() + 1) + "/" + fechaDesdeAux.getFullYear() : null,
      "fecHasta": fecHasta ? (fechaHastaAux.getDate() + 1) + "/" + (fechaHastaAux.getMonth() + 1) + "/" + fechaHastaAux.getFullYear() : null
    };

    return this._http.post(auxEndpoint, body);
  }

  public findUsuarios(): Observable<any> {
    let auxEndpoint = this.baseUrl + '/usuarios/find';
    return this._http.get(auxEndpoint);
  }

  public findTiposProcesos(): Observable<any> {
    let auxEndpoint = this.baseUrl + '/tipos/find';
    return this._http.get(auxEndpoint);
  }
}