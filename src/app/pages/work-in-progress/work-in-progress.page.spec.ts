import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkInProgressPage } from './work-in-progress.page';

describe('WorkInProgressPage', () => {
  let component: WorkInProgressPage;
  let fixture: ComponentFixture<WorkInProgressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkInProgressPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkInProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
