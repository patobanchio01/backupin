import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsMenuComponent } from './apps-menu.component';

describe('AppsMenuComponent', () => {
  let component: AppsMenuComponent;
  let fixture: ComponentFixture<AppsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
