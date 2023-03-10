import { Input, OnInit, Output, EventEmitter, Component, HostListener, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { ReportesService } from 'src/app/services/reportes.service';


@Component({
  selector: 'app-report-selector',
  templateUrl: './report-selector.component.html',
  styleUrls: ['./report-selector.component.scss']
})
export class ReportSelectorComponent implements OnInit {
  @Input() listaReportes!: any[];
  @Input() dataReceta: any;
  @Input() buscarParametrosAdicionales: boolean = false;
  @Output() cancelDialog = new EventEmitter<boolean>();
  @Output() selectorClose = new EventEmitter<any>();

  public jobName!: string;
  public seleccionoReporte: boolean = false;
  cambioOptionSelect: boolean = false;

  anoPrs!: number;
  nroPrs!: number;
  codEnt!: number;
  nomEnt!: string;
  codFar!: number;

  listaFiltros: string[] = [];
  listaFiltrosObligatorios: string[] = [];
  loading: boolean = false;
  listaCamposReporte: any = [];
  listaDataCamposReportes: any = {};
  hotKeyReportes: boolean = true;
  showCampos = false;
  listaparamsName = [];


  constructor(
    public reportesService: ReportesService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.setearDatosChips();

    setTimeout(() => {
      this.setFocusOn('jobName');
    }, 100);
  }

  @HostListener("document:keydown", ["$event"])
  controlKeydown(event?:any) {
    if (event && this.hotKeyReportes == true) {
      const tecla = event.key;
      switch (tecla) {
        case 'F9':
          if (event.ctrlKey == true) {
            this.close();
          } else {
            if (event) { event.preventDefault() };
            this.ejecutarReporte();
          }
          break;
        case 'Escape':
          this.close();
          break;
        default:
          break;
      }
    }
  }

  setearDatosChips() {
    if (this.dataReceta && this.dataReceta.presentacion) {
      this.anoPrs = this.dataReceta.presentacion.anoPrs;
      this.nroPrs = this.dataReceta.presentacion.nroPrs;
      this.codEnt = this.dataReceta.presentacion.codEnt;
      this.nomEnt = this.dataReceta.presentacion.nomEnt;
      this.codFar = this.dataReceta.farmacia.codFar;
    }
  }

  preSaveValidate() {
    if (this.jobName) {
      this.seleccionoReporte = true;
    } else {
      this.seleccionoReporte = false;
    }
  }

  estaActivo(campo: string) {
    if (campo == 'S') {
      return true;
    } else {
      return false;
    }
  }

  esObligatorio(campo: string) {
    if (campo == 'N') {
      return true;
    } else {
      return false;
    }
  }

  returnTypeInput(campo :any) {
    if (campo == 'N') {
      return 'number';
    } else {
      return 'text';
    }
  }

  close() {
    this.cancelDialog.emit(false);
  }

  selectedReport(reporte: string) {
    this.showCampos = false;
    if (reporte) {
      this.jobName = reporte;   
      this.listaCamposReporte=[];
      this.listaDataCamposReportes = {};
      this.listaparamsName=[];
      if (this.buscarParametrosAdicionales) {

        this.loading = true;
        this.listaCamposReporte = [];
        this.listaDataCamposReportes = [];
        this.reportesService.getConfigReporte(reporte).subscribe((res: any) => {
          this.loading = false;
         
          if (res.response.length > 0) {

            this.listaparamsName = res.response.filter((elemento:any) => elemento.paramName != 'codFar');
            this.listaCamposReporte =this.listaparamsName;

            for (let i = 0; i < this.listaCamposReporte.length; i++) {
              this.listaDataCamposReportes[this.listaparamsName[i]['paramName']] = null;
              
              if (this.listaCamposReporte[i].fieldType == 'S') {
                this.listaCamposReporte[i].paramValues.forEach((element:any) => {
                  if (element.flgDefault == 'S') {
                    this.listaDataCamposReportes[this.listaparamsName[i]['paramName']] = element.fieldId;
                  }
                });
              }

              this.autocompletarCamposReportes(this.listaparamsName[i]['paramName']);
              this.listaCamposReporte[i].paramName = this.listaparamsName[i]['paramName'];


            }
      
            this.showCampos = true;
            setTimeout(() => {
              this.setFocusOn('report-' + this.listaCamposReporte[0].paramName);
            }, 100);
          }
        });
      }
    }
  }

  autocompletarCamposReportes(campo:any) {
    const clavesDatosReceta = Object.keys(this.dataReceta)
    for (let i = 0; i < clavesDatosReceta.length; i++) {
      if (this.dataReceta && (typeof this.dataReceta[clavesDatosReceta[i]] === 'object')) {
        if (this.dataReceta[clavesDatosReceta[i]]?.hasOwnProperty(campo)) {
          this.listaDataCamposReportes[campo] = this.dataReceta[clavesDatosReceta[i]][campo];
        }
      } else {
        if (clavesDatosReceta[i] == campo) {
          this.listaDataCamposReportes[campo] = this.dataReceta[campo];
        }
      }
    }
  }

  setFocusOn(elementID: string) {
    let focusTarget = document.getElementById(elementID);
    this.cambioOptionSelect = false;
    try {
      if (focusTarget) {
        focusTarget.focus();
      }
    } catch {
      return;
    }
  }

  setFocusNext(campo:any) {
    let clavesCamposReceta = Object.keys(this.listaDataCamposReportes);
     
    let campoName = campo.slice(7);
    const sourceIndex = clavesCamposReceta.indexOf(campoName);
    const nextIndex = sourceIndex + 1;
    const targetElementID = clavesCamposReceta[nextIndex];
    if (nextIndex < clavesCamposReceta.length) {
      setTimeout(() => {
        this.setFocusOn('report-'+targetElementID);
      }, 150);
    } else {
      setTimeout(() => {
        this.setFocusOn('buttonConfirmar');
      }, 150);
      return;
    }
  }

  ejecutarReporte() {
    if (this.verificarCamposObligatoriosReportes() == false) {
      this.showNotification('Error!', 'No estan los datos obligatorios del reporte.', 5000);
    } else {
      let jsonToSend = {
        jobName: this.jobName,
        parametros: this.listaDataCamposReportes
      }

      this.selectorClose.emit(jsonToSend);
    }
  }

  showNotification(message: string, action: string, timer: number) {
    this._snackBar.open(message, action, {
      duration: timer
    });
  }

  verificarCamposObligatoriosReportes() {
    this.listaparamsName.forEach(campo => {
      if (this.esObligatorio(campo['flgOpcional'] || '') && !this.listaDataCamposReportes[campo['paramName']]) {
        return false;
      }
    });

    return true;
  }
}

