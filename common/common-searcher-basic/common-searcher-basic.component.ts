import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonFilter } from 'src/app/interfaces/CommonFilter';
import { LoteService } from 'src/app/services/lote.service';

@Component({
  selector: 'app-common-searcher-basic',
  templateUrl: './common-searcher-basic.component.html',
  styleUrls: ['./common-searcher-basic.component.scss']
})
export class CommonSearcherBasicComponent implements OnInit, AfterViewInit {
  @Input() searchParams: any = {};
  @Output() searcherBasicClose = new EventEmitter<any>();

  /*IMPLEMENTACION TABLA*/
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('TABLE') table!: MatTable<any>;


  public loading: boolean = false;
  tableDataSource: any;
  public searchData: any;
  sortedData: any;
  public targetElement: any
  public returnCode!: number;
  public targetVar!: string;
  public searchForLabel!: string;
  public searchContext!: CommonFilter;
  public searchStr!: string;
  public anoPrs: any
  public nroPrs: any
  public codEnt: any
  public serviceHasErrors: boolean = false;
  public noDataFound: boolean = true;
  public serviceErrorCode !: any;
  selectedRowIndex: number = 0;
  displayedColumns: string[] = ['cod'];
  displayedDescColumns: string[] = ['Codigo de Lote'];
  filterValue: any;
  codLotes: any = [];


  @HostListener("window:keydown.escape", ["$event"])
  @HostListener("window:keydown.control.f9", ["$event"])
  public cancel(event? : any) {
    if (event) {
      event.preventDefault();
      this.close();
    };
  }

  constructor(private _loteService: LoteService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loading = true;

    this.setDisplaySearchForLabel(this.searchParams.entity);

    this._loteService.getLotes(this.searchParams).subscribe(
      data => {
        //this.searchData = data.response;
        data.response.forEach((element :any) => {
          let lote = {
            cod: element
          }
          this.codLotes.push(lote);
        });
        this.searchData = this.codLotes;
        this.tableDataSource = new MatTableDataSource(this.searchData);

        this.sortedData = this.searchData.slice();
        this.tableDataSource.paginator = this.paginator;
        this.tableDataSource.sort = this.sort;
        // this.table.renderRows;

        setTimeout(() => {
          this.setFocusOn(this.searchData[0].cod);

        }, 100);
        this.loading = false;
      }, error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  public setDisplaySearchForLabel(baseSearchForStr :any) {
    switch (baseSearchForStr) {
      case 'lote': { this.searchForLabel = 'Lotes' } break;
      default: { this.searchForLabel = 'Entidades Genericas' } break;
    }
  }


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

  close() {
    this.searcherBasicClose.emit({ returnValue: this.returnCode, searchedFor: this.searchParams.target });
  }

  public setAndReturn(codigo : any) {
    this.returnCode = codigo;
    this.close();
  }

  setFocusSearch() {
    setTimeout(() => {
      this.selectedRowIndex = 0;
      this.setFocusOn(this.tableDataSource.filteredData[0].cod);
    }, 100);
  }

  focusSearch() {
    this.selectedRowIndex = -1;
  }

  applySearch(event: Event) {
    /* aplica la búsqueda sobre la grilla de resultados y trabaja sobre el paginbador para posicionarse en la primera página*/
    this.filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
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
      index = this.tableDataSource.filteredData.findIndex((element : any) => element.cod == row.cod);
    } else {
      index = this.tableDataSource['_data']['_value'].findIndex((element:any) => element.cod == row.cod);
    }

    return index;
  }

  highlight(_row: any, index:any) {
    this.selectedRowIndex = index;
    let indexTable = (this.tableDataSource.paginator['_pageSize'] * this.tableDataSource.paginator['_pageIndex']) + index;
    let rowTable = this.tableDataSource['_data']['_value'][indexTable];

    setTimeout(() => {
      this.setFocusOn(rowTable.cod);
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

    this.highlight(rowTable, 0);
  }
}
