import { Component, Input, OnInit, Output, EventEmitter, ViewChild, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { PaginatorTranslateComponent } from '../paginator-translate/paginator-translate.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonSearcherFilter } from 'src/app/interfaces/CommonSearcherFilter';
import { CommonSearcherReturn } from 'src/app/interfaces/CommonSearcherReturn';
import { SearchService } from 'src/app/services/search.service';

//VALORES POSIBLES PARA searchFor
//farmacia
//entidad
//medico
//afiliado
//producto
//control
//ctlItm
//ctlCab
//laboratorio
//droga
//composicion
//plan-entidad
//institucion
//tipo-tratamiento
//espec-medicas

@Component({
  selector: 'app-common-searcher',
  templateUrl: './common-searcher.component.html',
  styleUrls: ['./common-searcher.component.scss']
})
export class CommonSearcherComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Input() searchParams!: CommonSearcherFilter;
  @Output() searcherClose = new EventEmitter<CommonSearcherReturn>();
  @ViewChild("strBox") nameField!: ElementRef;

  /*IMPLEMENTACION TABLA*/
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('TABLE') table!: MatTable<any>;

  public loading: boolean = false;

  // Grilla
  tableDataSource: any;
  public searchData: any;
  sortedData: any;
  displayedColumns: string[] = ['codigo', 'descripcion'];
  displayedDescColumns: string[] = ['Codigo', 'Nombre/Descripcion'];

  public searchForLabel!: string;
  public returnValue!: string;
  public returnDescription!: string;
  public serviceHasErrors: boolean = false;
  public noDataFound: boolean = true;
  public serviceErrorCode : any;
  selectedRowIndex: number = 0;
  filterValue: any;


  @HostListener("window:keydown.escape", ["$event"])
  @HostListener("window:keydown.control.f9", ["$event"])
  public cancel(event? : any) {
    if (event) { event.preventDefault() };
    this.close();
  }

  constructor(
    private _PaginatorTranslateComponent: PaginatorTranslateComponent,
    private _searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.setDatosIniciales();
  }

  ngOnDestroy(): void {
  }

  setDatosIniciales() {
    this.visible = true;

    setTimeout(() => {
      let str = document.getElementById('strBox') || null
      if(str){
        str.focus();
      }
      this.setDisplaySearchForLabel(this.searchParams.entity);
    }, 100);
  }

  public close() {
    this.searcherClose.emit({ returnInto: this.searchParams.target, returnValue: this.returnValue, returnDescription: this.returnDescription, searchedFor: this.searchParams.entity });
  }

  public search() {
    this.loading = true;
    this._searchService.search(this.searchParams).subscribe((res: any) => {
      if (res.response.length <= 0) {
        this.noDataFound = true
        this.searchData = [];
      } else {
        this.noDataFound = false
        // Carga la tabla
        this.searchData = res.response;
        //focus en el primer elemento de la tabla (para navegavilidad en grilla)
        setTimeout(() => {
          this.setFocusOn(this.searchData[0].codigo);
        }, 100);
      }

      this.loading = false;

      this.tableDataSource = new MatTableDataSource(this.searchData);
      this.sortedData = this.searchData.slice();
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
      // this.table.renderRows;
    }, (error: any) => {
      this.searchData = [];
      this.loading = false;
      this.serviceHasErrors = true;
      this.serviceErrorCode = error.status;
    });
  }

  public setDisplaySearchForLabel(baseSearchForStr : any) {
    switch (baseSearchForStr) {
      case 'farmacia': { this.searchForLabel = 'Farmacia' } break;
      case 'colegio': { this.searchForLabel = 'Colegio' } break;
      case 'entidad': { this.searchForLabel = 'Entidad' } break;
      case 'medico': { this.searchForLabel = 'Médico' } break;
      case 'afiliado': { this.searchForLabel = 'Afiliado' } break;
      case 'producto': { this.searchForLabel = 'Producto' } break;
      case 'control': { this.searchForLabel = 'Controles' } break;
      case 'ctlItm': { this.searchForLabel = 'Control en ítem' } break;
      case 'ctlCab': { this.searchForLabel = 'Control en cabecera' } break;
      case 'laboratorio': { this.searchForLabel = 'Laboratorio' } break;
      case 'droga': { this.searchForLabel = 'Droga' } break;
      case 'composicion': { this.searchForLabel = 'Composición' } break;
      case 'institucion': { this.searchForLabel = 'Institución' } break;
      case 'tipo-tratamiento': { this.searchForLabel = 'Tipo de tratamiento' } break;
      case 'espec-medicas': { this.searchForLabel = 'Especialidades' } break;
      default: { this.searchForLabel = 'Entidades Genericas' } break;
    }
  }

  applySearch(event: Event) {
    /* aplica la búsqueda sobre la grilla de resultados y trabaja sobre el paginbador para posicionarse en la primera página*/
    this.filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }

  /*LOGICA PARA NAVEGABILIDAD DE GRILLA*/
  arrowDownEvent(row: object, index: number) {
    //para el caso de que haya aplicada una busqueda
    if (this.filterValue) {
      this.arrowDownSearch(row, index);
      return;
    }

    if (index < this.tableDataSource.paginator['_pageSize'] && !this.isLastPage()) {
      let nextrow = this.tableDataSource['_data']['_value'][index];
      this.highlight(nextrow, index);
    } else if (index == this.tableDataSource.paginator['_pageSize'] && !this.isLastPage()) {
      this.paginator.nextPage();
      let nextrow = this.tableDataSource['_data']['_value'][this.getIndex(row) + 1];
      this.tableDataSource(nextrow, 0);
    } else if (this.isLastPage()) {
      let indexFinal = this.tableDataSource.paginator['_length'] - (this.tableDataSource.paginator['_pageSize'] * this.tableDataSource.paginator['_pageIndex']);
      if (index < indexFinal) {
        this.highlight(row, index);
      }
    } else {
      this.highlight(row, index);
    }
  }

  arrowDownSearch(row: object, index: number) {
    if (index < this.tableDataSource.paginator['_pageSize'] && !this.isLastPage()) {
      let indexSearch = this.getIndex(row) + 1;
      let rowSearch = this.tableDataSource.filteredData[indexSearch];
      this.highlight(rowSearch, index);
    } else if (index == this.tableDataSource.paginator['_pageSize'] && !this.isLastPage()) {
      this.paginator.nextPage();
      let rowSearch = this.tableDataSource.filteredData[this.getIndex(row) + 1];
      this.highlight(rowSearch, 0);
    } else if (this.isLastPage()) {
      let indexFinal = this.tableDataSource.paginator['_length'] - (this.tableDataSource.paginator['_pageSize'] * this.tableDataSource.paginator['_pageIndex']);

      if (index < indexFinal) {
        let rowSearch;
        if (this.tableDataSource.filteredData[this.getIndex(row) + 1] == this.tableDataSource.paginator['_length']) {
          rowSearch = this.tableDataSource.filteredData[this.getIndex(row)];
        } else {
          rowSearch = this.tableDataSource.filteredData[this.getIndex(row) + 1];
        }

        this.highlight(rowSearch, index);
      }
    } else {
      let indexSearch = this.getIndex(row);
      let rowSearch = this.tableDataSource.filteredData[indexSearch];
      this.highlight(rowSearch, indexSearch);
    }
  }

  arrowUpEvent(row: object, index: number) {
    //para el caso de que haya aplicada una busqueda
    if (this.filterValue) {
      this.arrowUpSearch(row, index);
      return;
    }

    if (index >= 0) {
      let nextrow = this.tableDataSource['_data']['_value'][index];

      if (nextrow != undefined) {
        this.highlight(nextrow, index);
      }
    } else if (index == -1 && this.tableDataSource.paginator['_pageIndex'] != 0) {
      this.paginator.previousPage();
      let nextrow = this.tableDataSource['_data']['_value'][this.getIndex(row) - 1];

      if (nextrow != undefined) {
        this.highlight(nextrow, this.tableDataSource.paginator['_pageSize'] - 1);
      }
    }
  }

  arrowUpSearch(row: object, index: number) {
    if (index >= 0) {
      let nextrow = this.tableDataSource.filteredData[this.getIndex(row) - 1];
      if (nextrow != undefined) {
        this.highlight(nextrow, index);
      }
    } else if (index == -1 && this.tableDataSource.paginator['_pageIndex'] != 0) {
      this.paginator.previousPage();
      let nextrow = this.tableDataSource.filteredData[this.getIndex(row) - 1];
      if (nextrow != undefined) {
        this.highlight(nextrow, this.tableDataSource.paginator['_pageSize'] - 1);
      }
    }
  }

  isLastPage() {
    let maxPage = this.tableDataSource.paginator['_pageSize'] * (this.tableDataSource.paginator['_pageIndex'] + 1)
    if (maxPage >= this.tableDataSource.paginator['_length']) {
      return true;
    } else {
      return false;
    }
  }

  getIndex(row:any) {
    let index;
    //en caso de que este aplicado una busqueda
    if (this.filterValue) {
      index = this.tableDataSource.filteredData.findIndex((element:any) => element.codigo == row.codigo);
    } else {
      index = this.tableDataSource['_data']['_value'].findIndex((element:any) => element.codigo == row.codigo);
    }

    return index;
  }

  highlight(row: any, index:any) {
    this.selectedRowIndex = index;
    let indexTable = (this.tableDataSource.paginator['_pageSize'] * this.tableDataSource.paginator['_pageIndex']) + index;
    let rowTable = this.tableDataSource['_data']['_value'][indexTable];
    this.returnValue = rowTable.codigo;
    this.returnDescription = rowTable.descripcion;

    setTimeout(() => {
      //Este caso es para cuando hay aplicada una busqueda
      if (this.filterValue) {
        this.setFocusOn(row.codigo);
      } else {
        this.setFocusOn(rowTable.codigo);
      }
    }, 100);
  }

  setFocusOn(elementID: string) {
    let focusTarget = document.getElementById(elementID);

    try {
      if(focusTarget){
        focusTarget.focus();
      }
    } catch {
      return;
    }
  }

  pageEvent(event:any) {
    let index = event.pageIndex * event.pageSize;
    let rowTable = this.tableDataSource['_data']['_value'][index];

    //Este caso es para cuando hay aplicada una busqueda
    if (this.filterValue) {
      let row = this.tableDataSource.filteredData[index]
      this.highlight(row, 0);
    } else {
      this.highlight(rowTable, 0);
    }
  }

  setFocusSearch() {
    setTimeout(() => {
      this.selectedRowIndex = 0;
      this.highlight(this.tableDataSource.filteredData[0], 0)
    }, 100)
  }

  focusSearch() {
    this.selectedRowIndex = -1;
  }
}
