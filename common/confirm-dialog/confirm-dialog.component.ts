import { ChangeDetectionStrategy, OnInit, Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  private modalAbiertoHotkey: boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cancelText: string,
    confirmText: string,
    message: string,
    messageSec: string,
    title: string,
    type: string
  }, private mdDialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  public close(value:any) {
    this.modalAbiertoHotkey = false;
    this.mdDialogRef.close(value);
  }

  @HostListener("document:keydown", ["$event"])
  controlKeydown(event?:any) {
    if (event && this.modalAbiertoHotkey == true) {
      const tecla = event.key;
      switch (tecla) {
        case 'Escape':
          event.preventDefault();
          this.close(false);
          break;
        case 'F9':
          event.preventDefault();
          if (event.ctrlKey == true) {
            this.close(false);
          } else {
            this.close(true);
          }
          break;
      }
    }
  }

  ngOnInit(): void {
    //console.log(this.data);
  }
}
