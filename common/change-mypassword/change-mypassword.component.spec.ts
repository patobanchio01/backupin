import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMypasswordComponent } from './change-mypassword.component';

describe('ChangeMypasswordComponent', () => {
  let component: ChangeMypasswordComponent;
  let fixture: ComponentFixture<ChangeMypasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMypasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMypasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
