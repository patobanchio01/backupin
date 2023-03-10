import { Component, Input, Output, OnInit, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-pdf-report-viewer',
  templateUrl: './pdf-report-viewer.component.html',
  styleUrls: ['./pdf-report-viewer.component.scss']
})
export class PdfReportViewerComponent implements OnInit {
  @Input() ReportData: any
  @Output() closePdfReportDialog = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    this.loadReport();
  }

  loading: boolean = true;
  messageTitle: string = '';
  messageText: string = ''
  messageType: string = ''
  showOnlineBT: boolean = false
  showCacheBT: boolean = false
  public ReportURL: string = '';
  public reportSource!: string;
  responseCode: string = '';
  dialogTitle!: string;

  @HostListener('window:keydown.escape', ['$event'])
  @HostListener('window:keydown.control.f9', ['$event'])
  closeModal(event? : any) {
    if (event) { event.preventDefault() };

    this.closePdfReportDialog.emit(true);
  }

  loadReport() {
    //console.log('Loading report with reportDAta = ');
    //console.dir(this.ReportData);

    this.responseCode = this.ReportData.codigo;
    this.dialogTitle = this.ReportData.tituloReporte ? this.ReportData.tituloReporte : 'Reporte';
    //console.log('ResponseCode = ' + this.responseCode);

    if (this.responseCode === "100") {
      //Mostrar leyenbda en el modal, por ahora sólo console.log
      this.showMessage('Error', 'Parametros no validos, revise la información y vuelva a intentarlo', false, false);
      //this.setReportURL();
    } else if (this.responseCode === "0" || this.responseCode === "1") {
      this.setReportURL('online');
      //this.showMessage('Error', 'Problemas en la ejecución del reporte en la base de datos', false, false);
    } else if (this.responseCode === "2") {
      // 2 -- Hay uno igual en ejecucion para esos parametros ==> muestra mensaje y
      // boton OK, no ejecuta reporte.
      this.showMessage('Atención', 'Hay uno igual en ejecucion para esos parametros, por favor espere o vuelva más tarde', false, false);
      //this.setReportURL();
    } else if (this.responseCode === "3") {
      this.showMessage('Atención', 'Hay un reporte en caché. Puede elegir entre ver el reporte ya generado o volver a generarlo', true, true);
    } else if (this.responseCode === "4") {
      //Sólo caché
      this.showMessage('Atención', 'El reporte solicitado será mostrado desde el caché', false, false);
      this.setReportURL('cache');
    } else if (this.responseCode === "5") {
      // Re-Visualizacion desde el cache, sin aviso.
      this.setReportURL('cache');
    } else {
      this.showMessage('Atención', 'Haga click en el botón y aguarde mientras el reporte se genera', false, false);
      this.setReportURL('online');
    }

    this.loading = false
  }

  setReportURL(source : any) {
    //console.log('Voy setear la url');
    //console.dir(this.ReportData);
    if (this.ReportData.urlReporte && source === "online") {
      this.ReportURL = this.ReportData.urlReporte;
    } else if (this.ReportData.urlCacheReporte && source === "cache") {
      this.ReportURL = this.ReportData.urlCacheReporte;
    } else {
      this.ReportURL = ''
    }

    let report = document.getElementById('reportContainer');
    if (report){
      report.setAttribute('src', this.ReportURL);
    } 
    this.loading = false;
  }

  showMessage(title:any, body:any, OnlineBtn?:any, CacheBtn?:any) {
    this.messageTitle = title;
    this.messageText = body;
    this.messageType = this.responseCode
    this.showOnlineBT = OnlineBtn;
    //this.showOnlineBT = true;
    this.showCacheBT = CacheBtn
    //this.showCacheBT = true
  }
}
