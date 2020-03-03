import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogViewerPage } from './log-viewer.page';

describe('LogViewerPage', () => {
  let component: LogViewerPage;
  let fixture: ComponentFixture<LogViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogViewerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
