import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-change-mypassword',
  templateUrl: './change-mypassword.component.html',
  styleUrls: ['./change-mypassword.component.scss']
})
export class ChangeMypasswordComponent implements OnInit {
  constructor(
    public _UserService: UserService,
  ) { }

  ngOnInit(): void {

  }

  helpPanelExpanded: boolean = false;
  passwordsVisibles: boolean = false;
  oldPassword!: string;
  newPassword!: string;
  newPasswordConfirm!: string;
  newPassValidateError!: string;
  showConfirm: boolean = false;
  showErrorBanner: boolean = false;
  notificationBannerText!: string;
  errorBannerText!: string;
  newPasswordsMatch: boolean = true;
  public errors: string[] = [];

  logout() {
    this._UserService.logOut();
  }

  newPassValidate() {
    //console.log('Comienzo las validaciones');
    this.errors = [];
    if (this.newPassword && this.newPassword && this.newPasswordConfirm) {
      /*chequeo que la nueva pass y su confirmación sean iguales*/
      if (this.newPasswordConfirm !== this.newPassword) {
        this.newPasswordsMatch = false;
        this.newPassValidateError = 'Las contraseñas no coinciden';
        this.errors.push('Verifique que la contraseña indicada en el campo Nueva contraseña coincida con lo ingresado en Repita su nueva contraseña');
        //return false
      } else {
        //console.log('Las contraseñas son iguales, Perfec!');
      }

      /*chequeo longitud de la nueva password min 8 max 12*/
      if (this.newPassword.length < 8 || this.newPassword.length > 12) {
        //this.newPassHasErrors=true;
        this.errors.push('Error en cantidad de caracteres: Min 8, Max 12');
        //return false
      } else {
        //console.log('Conteo de caracteres OK: ' + this.newPassword.length + ' caracteres');
      }

      /*at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters*/
      //if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(this.newPassword))){
      if (!(/^(?=.*\w)(?=\w*[a-z])(?=\w*[A-Z])(?=\w*[a-zA-Z])\w{8,12}$/.test(this.newPassword))) { //void special characters
        //this.newPassHasErrors=true;
        this.errors.push('La contraseña debe contener al menos 1 mayuscula, 1 minuscula y 1 numero. NO puede contener caracteres especiales');
        //return false;
      } else {
        //this.newPassHasErrors=false;
        //console.log('Complejidad OK');
      }

      /*must NOT contain userID*/
      let auxOBJ = JSON.parse(localStorage.getItem('allUserData') || '');
      let userName = auxOBJ.codUsr.toUpperCase();
      let firstName = auxOBJ.nombre.toUpperCase();
      let lastName = auxOBJ.apellido.toUpperCase();
      let auxNewPassWord = this.newPassword.toUpperCase();
      if (auxNewPassWord.includes(userName) == true) {
        this.errors.push('La contraseña no puede contener nombre de usuario');
        //return false
      }

      /*Must NOT contain user name or lastName*/
      if (auxNewPassWord.includes(firstName) == true) {
        this.errors.push('La contraseña no puede contener su nombre');
      }

      if (auxNewPassWord.includes(lastName) == true) {
        this.errors.push('La contraseña no puede contener su apellido');
      }

    } else {
      this.errors.push('Los campos de contraseña no pueden estar vacíos');
      //return false;
    }
  }

  hideNoticationBanner() {
    this.showConfirm = false;
  }

  showNoticationBanner() {
    this.showConfirm = true;
  }

  togglePasswordsVisibility() {
    this.passwordsVisibles = !this.passwordsVisibles;
    var passFields = document.getElementsByClassName("passwordField");
    var newState: string;
    if (this.passwordsVisibles == true) {
      newState = "text"
    } else {
      newState = "password"
    }
    for (let i = 0; i < passFields.length; i++) {
      passFields[i].setAttribute('type', newState);
    }
  }

  changeMyPassword() {
    this.newPassValidate();
    if (this.errors.length === 0) {
      this._UserService.changeMyPassword(this._UserService.getUserName(), this.oldPassword, this.newPassword).subscribe((res: any) => {
        this.notificationBannerText = res.response + " debe volver a iniciar sesión para finalizar este proceso";
        this.showNoticationBanner();
      }, (error: any) => {
        this.showErrorBanner = true;
        this.errorBannerText = "Se ha producido un error al cambiar la contraseña (" + error.status + "). Verifique que la nueva contraseña no coincida con alguna de sus últimas 12 y vuelva a intentar";

      });

    } else {
      return
    }
  }
}
