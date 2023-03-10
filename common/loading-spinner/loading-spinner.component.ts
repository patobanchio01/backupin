import { Component, OnInit, Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerComponent implements OnInit {

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  loading!: boolean;

  constructor() { }

  public setStatus(visible: boolean) {
    this.loading = visible;
  }

  ngOnInit(): void {
  }

}
