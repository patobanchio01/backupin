import {Component, OnInit, ViewChild, Injectable, AfterViewInit} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {catchError, map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import {of as observableOf} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';


/* IMPORTANTE!! Internacionalización de textos en paginador*/
@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();  
    this.getAndInitTranslations();
  }
/*Translates paginator options and labels*/
  getAndInitTranslations() {
    this.itemsPerPageLabel = "elementos por página";
    this.nextPageLabel = "Siguiente";
    this.previousPageLabel = "Anterior";
    this.changes.next();
}
  override getRangeLabel = (page: number, pageSize: number, length: number) =>  {
  if (length === 0 || pageSize === 0) {
    return '0 de ' + length;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `${startIndex + 1} a ${endIndex} de ${length} resultados`;
}

}

@Component({
  selector: 'app-paginator-translate',
  templateUrl: './paginator-translate.component.html',
  styleUrls: ['./paginator-translate.component.scss']
})
export class PaginatorTranslateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
