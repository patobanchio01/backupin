import { Injectable } from '@angular/core';

const sessionValid: boolean = true;
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  public getSessionToken() {
    let auxSessionToken = document.cookie.split('; ').find(row => row.startsWith('OAMAuthnCookie')) || ''
      .split('=')[1];
    return auxSessionToken;
  }
}
