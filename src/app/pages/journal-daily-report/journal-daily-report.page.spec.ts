import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { JournalDailyReportPage } from './journal-daily-report.page';
import { DataService } from '../../services/data/data.service';
import { dataServiceSpy } from '../../services/data/data.service.mock';

describe('JournalDailyReportPage', () => {
  let component: JournalDailyReportPage;
  let fixture: ComponentFixture<JournalDailyReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JournalDailyReportPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule],
      providers: [
        { provide: DataService, useValue: dataServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalDailyReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
