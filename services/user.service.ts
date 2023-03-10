import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { InfoDialogService } from './info-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = "/api/prodis/v1/seguridad";

  constructor(
    private _http: HttpClient,
    private _SessionService: SessionService,
    private _router: Router,
    private infoDialogService: InfoDialogService,
  ) { }

  public getUserName() {
    let userName = document.cookie.split('; ').find(row => row.startsWith('OAM_REMOTE_USER')) || ''
    .split('=')[1];
    return userName;
  }

  public getUserLDAPProvID() {
    let udOBJ = JSON.parse(localStorage.getItem('allUserData') || '');
    if (udOBJ) {
      return udOBJ.proveedor.codigo
    } else {
      console.error('No existe la key allUserData en el localStorage');
    }
  }

  deleteAllCookies() {
    //console.log('dentro de la FC deleteAllCookies');
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }

  public secureLogin() {
    let auxUserName = this.getUserName().toUpperCase();
    let auxEndpoint = '/api/login';
    let body = { "username": auxUserName };

    this._http.post(auxEndpoint, body, { observe: 'response' }).subscribe((res: any) => {
      let secureSessionTokenSTR = res.headers.get('authorization');
      localStorage.setItem('secureSessionToken', secureSessionTokenSTR);
      this.getUserData().subscribe((res: any) => {
        //Si no tengo la key en local storage recargo la página para que se puedan renderizar las opciones de menú
        //Esto es un workaround por problemas de sincronismo, ya que el servicio retorna /buscar retorna los valores de userData después que la vista los necesita
        if (!localStorage.getItem('allUserData')) {
          window.location.reload();
        }

        localStorage.setItem('allUserData', JSON.stringify(res.response));
        localStorage.setItem('userName', res.response.codUsrApp);
      }, (err: any) => {
        if (err.status === 422) {
          //console.error('Error: ' + err.error.message);
          const options = {
            title: 'Error!!',
            message: 'No se ha podido obtener los datos del usuario.',
            messageSec: err.error.message,
            cancelText: 'Cerrar'
          };
          this.infoDialogService.open(options);
        } else {
          console.error('No se ha podido obtener los datos del usuario (' + err.status + ')');
          this._router.navigateByUrl('/out-off-service');
        }
      });
    }, (error) => {
      console.error(error);
      this._router.navigateByUrl('/out-off-service');
    });
  }

  public logOut() {
    let url = '../';
    this.deleteAllCookies();
    localStorage.clear();
    this._http.post('/prodislogin/signout.jsp', null);
    window.location.reload();
  }

  // Password
  public changeMyPassword(userName : any, oldPass: any, newPass: any) {
    //reset password for an user
    let auxEndpoint = this.baseUrl + '/password/update';
    let body = {
      "codUsr": userName,
      "password": oldPass,
      "oldPassword": newPass
    };
    return this._http.post(auxEndpoint, body);
  }

  public resetPassword(userName: any) {
    //reset password for an user
    let auxEndpoint = this.baseUrl + '/password/reset';
    let body = {
      "codUsr": userName,
    };
    return this._http.post(auxEndpoint, body);
  }

  // Groups
  public getAll(organization: string): Observable<any> {
    let idProvInt = organization;
    let auxEndpoint = this.baseUrl + '/groups/members/find?idProvInt=' + idProvInt;
    return this._http.get(auxEndpoint);
  }

  // Users
  public getUserData(): Observable<any> {
    let userName = this.getUserName().toUpperCase();
    //console.log("UserName as soon as possible " + userName);
    if (userName) {
      let auxEndpoint = this.baseUrl + '/users/xl/findByPk?codUsr=' + userName;
      return this._http.get(auxEndpoint);
    } else {
      console.error('NO ES POSIBLE OBTENER LOS DATOS DEL USUARIO');
      localStorage.setItem('userName', '');
      return null as any
    }
  }

  public createUser(params : any) {
    let auxEndpoint = this.baseUrl + '/users/new';
    let body = params;
    return this._http.put(auxEndpoint, body);
  }

  public modifyUser(params: any) {
    let auxEndpoint = this.baseUrl + '/users/update';
    let body = params;
    return this._http.post(auxEndpoint, body);
  }

  //removes a user
  public deleteUser(username: string) {
    let auxEndpoint = this.baseUrl + '/users/' + username + '/delete';
    return this._http.delete(auxEndpoint);
  }

  public getUserInfo(username: string) {
    let auxEndpoint = this.baseUrl + '/users/findByPk?codUsr=' + username;
    return this._http.get(auxEndpoint);
  }
}
