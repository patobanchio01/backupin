import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColaProcesosModalComponent } from './cola-procesos-modal.component';

describe('ColaProcesosModalComponent', () => {
  let component: ColaProcesosModalComponent;
  let fixture: ComponentFixture<ColaProcesosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColaProcesosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColaProcesosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
