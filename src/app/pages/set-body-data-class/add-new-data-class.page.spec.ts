import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavController, IonicModule } from '@ionic/angular';
import { navControllerSpy } from '../../../mocks/angular/nav-controller';

import { AddNewDataClassPage } from './add-new-data-class.page';

describe('AddNewDataClassPage', () => {
  let component: AddNewDataClassPage;
  let fixture: ComponentFixture<AddNewDataClassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewDataClassPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDataClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
