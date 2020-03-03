import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPage } from './tour.page';

describe('TourPage', () => {
  let component: TourPage;
  let fixture: ComponentFixture<TourPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
