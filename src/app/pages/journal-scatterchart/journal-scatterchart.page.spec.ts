import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { socialSharingSpy } from '../../../mocks/native/social-sharing';

import { JournalScatterchartPage } from './journal-scatterchart.page';
import { DataService } from '../../services/data/data.service';
import { dataServiceSpy } from '../../services/data/data.service.mock';

describe('JournalScatterchartPage', () => {
  let component: JournalScatterchartPage;
  let fixture: ComponentFixture<JournalScatterchartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JournalScatterchartPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: SocialSharing, useValue: socialSharingSpy },
        { provide: DataService, useValue: dataServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalScatterchartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
