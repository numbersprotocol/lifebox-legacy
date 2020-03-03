import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavController } from '@ionic/angular';
import { navControllerSpy } from '../../../mocks/angular/nav-controller';

import { JournalPage } from './journal.page';
import { DataService } from '../../services/data/data.service';
import { dataServiceSpy } from '../../services/data/data.service.mock';

describe('JournalPage', () => {
  let component: JournalPage;
  let fixture: ComponentFixture<JournalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JournalPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: DataService, useValue: dataServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
