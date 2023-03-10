import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorTranslateComponent } from './paginator-translate.component';

describe('PaginatorTranslateComponent', () => {
  let component: PaginatorTranslateComponent;
  let fixture: ComponentFixture<PaginatorTranslateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginatorTranslateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
