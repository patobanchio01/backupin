import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOfServiceComponent } from './out-of-service.component';

describe('OutOfServiceComponent', () => {
  let component: OutOfServiceComponent;
  let fixture: ComponentFixture<OutOfServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutOfServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
