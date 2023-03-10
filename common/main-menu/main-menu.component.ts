import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  userName!: string;
  constructor(
    private _userService: UserService
  ) { }

  setUserName() {
    this.userName = localStorage.getItem('userName') || '';
  }

  ngOnInit(): void {
    this.setUserName();
  }
}
