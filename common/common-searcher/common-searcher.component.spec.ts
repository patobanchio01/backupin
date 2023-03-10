import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSearcherComponent } from './common-searcher.component';

describe('CommonSearcherComponent', () => {
  let component: CommonSearcherComponent;
  let fixture: ComponentFixture<CommonSearcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSearcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
