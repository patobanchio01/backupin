import { ChangeDetectionStrategy, OnInit, Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cancelText: string,
    message: string,
    messageSec: string,
    title: string,
    type: string
  }, private mdDialogRef: MatDialogRef<InfoDialogComponent>) { }


  public cancel() {
    this.close(false);
  }

  public close(value :any) {
    this.mdDialogRef.close(value);
  }

  @HostListener("window:keydown.escape", ["$event"])
  @HostListener("window:keydown.control.f9", ["$event"])
  public onEsc(event?:any) {
    if (event) { event.preventDefault() };

    this.close(false);
  }

  ngOnInit(): void {
    //console.log(this.data);
  }
}
