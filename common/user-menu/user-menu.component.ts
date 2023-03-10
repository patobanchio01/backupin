import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public userName!:string;

  constructor(
    private _userService:UserService
  ) { }

  setUserName(){
    this.userName = localStorage.getItem('userName') || '';
  }

  ngOnInit(): void {
    this.setUserName();
  }

}
