import { Component, OnInit, ViewChild, Injectable, Inject, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from 'src/app/common/loading-spinner/loading-spinner.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})



export class DashboardLayoutComponent implements OnInit {
  @ViewChild(DashboardComponent) ChildDashboardComponent!: DashboardComponent;



  userName!: string;
  constructor(
    public _UserService: UserService,
    private _LoadingSpinner: LoadingSpinnerComponent,
  ) { }

  loading: boolean = false;

  logOut() {
    //console.log('Logging out into dashboard component');
    this._UserService.logOut();
  }

  secureLoginDo() {
    this._UserService.secureLogin();
  }

  ngOnInit() {
    //localStorage.clear();
    this.secureLoginDo();
    this.userName = localStorage.getItem('userName') || '';
  }

  ngAfterViewInit() {
  }
}
