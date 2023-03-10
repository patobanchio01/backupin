import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { InfoDialogComponent } from '../common/info-dialog/info-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class InfoDialogService {

  constructor(private dialog: MatDialog) { }
  dialogRef!: MatDialogRef<InfoDialogComponent>;

  public open(options : any) {
    this.dialogRef = this.dialog.open(InfoDialogComponent, {
      data: {
        type: options.type,
        title: options.title,
        message: options.message,
        messageSec: options.messageSec,
        cancelText: options.cancelText
      }
    });
  }
}