import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfReportViewerComponent } from './pdf-report-viewer.component';

describe('PdfReportViewerComponent', () => {
  let component: PdfReportViewerComponent;
  let fixture: ComponentFixture<PdfReportViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfReportViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfReportViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
