import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialog: MatDialog) { }
  dialogRef!: MatDialogRef<ConfirmDialogComponent>;

  public open(options : any) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: options.type,
        title: options.title,
        message: options.message,
        messageSec: options.messageSec,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      }
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
      return res;
    }));
  }
}
