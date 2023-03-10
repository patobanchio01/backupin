import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogViewerDialogComponent } from './log-viewer-dialog.component';

describe('LogViewerDialogComponent', () => {
  let component: LogViewerDialogComponent;
  let fixture: ComponentFixture<LogViewerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogViewerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
