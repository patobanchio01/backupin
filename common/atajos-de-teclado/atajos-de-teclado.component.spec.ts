import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtajosDeTecladoComponent } from './atajos-de-teclado.component';

describe('AtajosDeTecladoComponent', () => {
  let component: AtajosDeTecladoComponent;
  let fixture: ComponentFixture<AtajosDeTecladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtajosDeTecladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtajosDeTecladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
