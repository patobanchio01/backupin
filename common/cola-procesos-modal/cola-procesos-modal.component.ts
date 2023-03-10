import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { ColaProcesosService } from 'src/app/services/cola-procesos.service';
import { LogViewerService } from 'src/app/services/log-viewer.service';
import { Proceso } from 'src/app/interfaces/Proceso';


enum ColumnaColaProcesos {
  codEstPrc = 'codEstPrc',
  codTipPrc = 'codTipPrc',
  codUsrSso = 'codUsrSso',
  desLog = 'desLog',
  desMsg = 'desMsg',
  fecEjePrc = 'fecEjePrc',
  fecFinPrc = 'fecFinPrc',
  fecInp = 'fecInp',
  nomLot = 'nomLot',
  nomPrc = 'nomPrc',
  nroPrc = 'nroPrc'
}

@Component({
  selector: 'app-cola-procesos-modal',
  templateUrl: './cola-procesos-modal.component.html',
  styleUrls: ['./cola-procesos-modal.component.scss']
})
export class ColaProcesosModalComponent implements OnInit {
  @Input() anoPrs!: number;
  @Input() nroPrs!: number;
  @Input() codEnt!: number;
  @Input() codFar!: number;
  @Input() codColFar!: number;
  @Output() selectedBoxNumber = new EventEmitter<string>();
  @Output() cancelDialog = new EventEmitter<boolean>();

  public loading = false;
  public gridData!: Proceso[];
  public gridDataUnfiltered!: Proceso[];
  public noResults = false;
  public noResultsMessage!: string;
  public hasErrors = false;
  public hasErrorsMessage!: string;
  public dataSource: any;
  public sortedData: any;

  // Filtros
  codTipPrc!: string;
  codEstPrc!: string;
  fecDesde!: string;
  fecHasta!: string;
  fechasValidas: boolean = true;
  soloUsrAct: boolean = true;
  fechaUltAct!: Date;

  // Timers
  refreshInterval: number = 60;
  refreshIntervalMin: number = 0; //in seconds
  refreshIntervalMax: number = 300; //in seconds
  refreshTimer!: any;
  subsDataTable!: Subscription;

  listaCodEstPrc = [
    { id: '1', descripcion: 'Pendiente' },
    { id: '2', descripcion: 'En Proceso' },
    { id: '3', descripcion: 'Finalizado OK' },
    { id: '4', descripcion: 'Finalizado con ERROR' }
  ];
  listaCodTipPrc = [];

  public displayedColumns = [
    ColumnaColaProcesos.nroPrc,
    ColumnaColaProcesos.codTipPrc,
    ColumnaColaProcesos.nomLot,
    ColumnaColaProcesos.nomPrc,
    ColumnaColaProcesos.codEstPrc,
    ColumnaColaProcesos.codUsrSso,
    ColumnaColaProcesos.fecEjePrc,
    ColumnaColaProcesos.fecFinPrc,
    ColumnaColaProcesos.fecInp,
    ColumnaColaProcesos.desMsg,
    ColumnaColaProcesos.desLog,
  ];

  public xtendendDisplayedColumns = [
    { displayName: 'Id', id: ColumnaColaProcesos.nroPrc },
    { displayName: 'Tipo', id: ColumnaColaProcesos.codTipPrc },
    { displayName: 'Descripcion', id: ColumnaColaProcesos.nomLot },
    { displayName: 'Proceso', id: ColumnaColaProcesos.nomPrc },
    { displayName: 'Estado', id: ColumnaColaProcesos.codEstPrc },
    { displayName: 'Usuario', id: ColumnaColaProcesos.codUsrSso },
    { displayName: 'Fec. Inicio', id: ColumnaColaProcesos.fecEjePrc },
    { displayName: 'Fec. Fin', id: ColumnaColaProcesos.fecFinPrc },
    { displayName: 'Fec. Encolado', id: ColumnaColaProcesos.fecInp },
    { displayName: 'Mensaje Rta', id: ColumnaColaProcesos.desMsg },
    { displayName: 'Log', id: ColumnaColaProcesos.desLog },
  ];

  constructor(
    private _adapter: DateAdapter<any>,
    public colaProcesosService: ColaProcesosService,
    private logViewerService: LogViewerService,
    public _UserService: UserService,
    private dialogService: ConfirmDialogService,
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit(): void {
    this._adapter.setLocale('es');
    this.getTableData();
    this.getTiposProcesos();
  }

  ngOnDestroy() {
    this.stopRealTimeRefresh();
  }

  private getTiposProcesos(): void {
    this.loading = true;

    this.listaCodTipPrc = [];
    this.colaProcesosService.findTiposProcesos().subscribe((res) => {
      if (res.response) {
        this.listaCodTipPrc = res.response;
      }

      this.loading = false;
    }, (err: Error) => {
      this.listaCodTipPrc = [];
      this.hasErrors = true;
      this.hasErrorsMessage = `Se ha producido un error al obtener los tipos de procesos: ${err.message}`;
      this.loading = false;
    });
  }

  getTableData(): void {
    this.loading = true;

    // if (this.validateDates) {
    if (true) {
      this.subsDataTable = this.colaProcesosService.findHistorial(this.codTipPrc, this.codEstPrc, this.fecDesde, this.fecHasta).subscribe((res) => {
        this.hasErrors = false;
        this.noResults = false;

        this.gridData = [];
        this.gridDataUnfiltered = [];
        if (res.response) {
          this.gridData = res.response;
          this.gridDataUnfiltered = res.response;
          //console.log('Procesos en Cola= ' + JSON.stringify(this.gridData));
        } else {
          this.noResults = true;
          this.noResultsMessage = 'No hay procesos encolados';
        }
        this.updateTableData();

        this.loading = false;
      }, (err: Error) => {
        this.gridData = [];
        this.updateTableData();
        this.hasErrors = true;
        this.hasErrorsMessage = `Se ha producido un error al obtener los proceos de la cola: ${err.message}`;
        this.loading = false;
      });
    }
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.gridData);
    this.dataSource.paginator = this.paginator;
    this.sortedData = this.gridData.slice();
    this.dataSource.sort = this.sort;
  }

  updateTableData() {
    this.fechaUltAct = new Date();

    let gridDataAux = this.gridDataUnfiltered.slice();

    // Filtro de estado
    if (this.codEstPrc) {
      gridDataAux = gridDataAux.filter(p => p.codEstPrc.includes(this.codEstPrc));
    }

    // Filtro de tipo proceso
    if (this.codTipPrc) {
      gridDataAux = gridDataAux.filter(p => p.codTipPrc.includes(this.codTipPrc));
    }

    // Filtro de usuario conectado
    if (this.soloUsrAct) {
      let userName = this._UserService.getUserName().toUpperCase();
      gridDataAux = gridDataAux.filter(p => userName.includes(p.codUsrSso));
    }

    // Filtro de fechas
    if (this.fecDesde || this.fecHasta) {
      //let aux: Date = value.toDate();
      if (this.fecDesde) {
        let fecDesdeDate = new Date(this.fecDesde);
        if (this.fecHasta) {
          let fecHastaDate = new Date(this.fecHasta);

          gridDataAux = gridDataAux.filter(function (p) {
            var fechaSplit = p.fecInp.split('/', 3);
            var dateParsed = new Date(parseInt(fechaSplit[2]), parseInt(fechaSplit[1]) - 1, parseInt(fechaSplit[0]));

            return dateParsed >= fecDesdeDate && dateParsed <= fecHastaDate;
          });
        } else {
          gridDataAux = gridDataAux.filter(function (p) {
            var fechaSplit = p.fecInp.split('/', 3);
            var dateParsed = new Date(parseInt(fechaSplit[2]), parseInt(fechaSplit[1]) - 1, parseInt(fechaSplit[0]));

            return dateParsed >= fecDesdeDate;
          });
        }
      } else {
        let fecHastaDate = new Date(this.fecHasta);
        if (this.fecDesde) {
          let fecDesdeDate = new Date(this.fecDesde);

          gridDataAux = gridDataAux.filter(function (p) {
            var fechaSplit = p.fecInp.split('/', 3);
            var dateParsed = new Date(parseInt(fechaSplit[2]), parseInt(fechaSplit[1]) - 1, parseInt(fechaSplit[0]));

            return dateParsed >= fecDesdeDate && dateParsed <= fecHastaDate;
          });
        } else {
          gridDataAux = gridDataAux.filter(function (p) {
            var fechaSplit = p.fecInp.split('/', 3);
            var dateParsed = new Date(parseInt(fechaSplit[2]), parseInt(fechaSplit[1]) - 1, parseInt(fechaSplit[0]));

            return dateParsed <= fecHastaDate;
          });
        }
      }
    }

    // Refrescamos la grilla con los datos filtrados.
    this.gridData = gridDataAux.slice();
    this.refreshTable();
  }

  public applySearch(event: Event): void {
    /* aplica la búsqueda sobre la grilla de resultados y trabaja sobre el paginbador para posicionarse en la primera página*/
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public relanzarProcesoFallido(nroPrc: number): void {
    //console.log('Proc= ' + nroPrc);

    if (nroPrc && nroPrc > 0) {
      // Mostrar confirmacion
      const options = {
        title: 'Alerta!!',
        message: 'Esta a punto de re-ejecutar el proceso con id: ' + nroPrc + ', esta seguro que desea continuar?',
        cancelText: 'Cancelar',
        confirmText: 'Continuar'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        // console.log('User has selected ' + result);
        if (confirmed) {
          this.colaProcesosService.relaunchProcess(nroPrc).subscribe((res: any) => {
            if (res.response) {
              this.hasErrors = false;
              this.hasErrorsMessage = 'La operación se realizó con éxito';

              // Actualizamos la grilla.
              this.getTableData();
            } else {
              this.hasErrors = true;
              this.hasErrorsMessage = 'Se ha producido un error en el envío';
            }
          }, (error: Error) => {
            this.hasErrors = true;
            this.hasErrorsMessage = 'Se ha producido un error: ' + error.message;
          });
        }
      });
    }
  }

  verMensajeLog(mensajeLog: string) {
    //console.log(mensajeLog);
    const options = {
      title: 'Visor de Logs',
      message: mensajeLog,
      cancelText: 'Cerrar'
    };

    this.logViewerService.open(options);
  }

  validateDates(fechaDesde :any, fechaHasta:any) {
    if (fechaDesde && fechaHasta && fechaDesde >= fechaHasta) {
      this.fechasValidas = false;
    } else {
      this.fechasValidas = true;
    }
  }

  @HostListener("window:keydown.shift.f8", ["$event"])
  clearFilters(event? : any) {
    if (event) { event.preventDefault() };

    this.codEstPrc = '';
    this.codTipPrc = '';
    this.fecDesde = '';
    this.fecHasta = '';
    this.soloUsrAct = true;

    // Reiniciamos la grilla.
    this.gridData = this.gridDataUnfiltered.slice();
    this.updateTableData();

    this.fechasValidas = true
  }

  setTimerInterval() {
    // Elimino el timer anterior.
    this.stopRealTimeRefresh();

    if (this.refreshInterval > 0) {
      // Obtengo el tiempo en milisegundos
      let refresIntervalMs = this.refreshInterval * 1000;

      this.refreshTimer = setInterval(() => {
        this.getTableData();
      }, refresIntervalMs);
    }
  }

  stopRealTimeRefresh() {
    clearInterval(this.refreshTimer);
    if (this.subsDataTable) {
      this.subsDataTable.unsubscribe;
    }
  }

  formatRealTimeSlider(value: number) {
    if (value >= this.refreshIntervalMin) {
      return (value);
    }
    return value;
  }
}
