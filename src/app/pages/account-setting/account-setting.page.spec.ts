import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingPage } from './account-setting.page';

describe('AccountSettingPage', () => {
  let component: AccountSettingPage;
  let fixture: ComponentFixture<AccountSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
