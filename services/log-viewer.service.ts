import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LogViewerDialogComponent } from '../common/log-viewer-dialog/log-viewer-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class LogViewerService {

  constructor(private dialog: MatDialog) { }
  dialogRef!: MatDialogRef<LogViewerDialogComponent>;

  public open(options : any) {
    this.dialogRef = this.dialog.open(LogViewerDialogComponent, {
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