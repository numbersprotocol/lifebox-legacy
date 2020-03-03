import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPedometerPage } from './data-pedometer.page';

describe('DataPedometerPage', () => {
  let component: DataPedometerPage;
  let fixture: ComponentFixture<DataPedometerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPedometerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPedometerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
