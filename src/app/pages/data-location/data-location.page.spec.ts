import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLocationPage } from './data-location.page';

describe('DataLocationPage', () => {
  let component: DataLocationPage;
  let fixture: ComponentFixture<DataLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
