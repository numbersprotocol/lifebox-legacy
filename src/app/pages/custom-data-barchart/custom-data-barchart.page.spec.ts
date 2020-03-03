import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { socialSharingSpy } from '../../../mocks/native/social-sharing';

import { of } from 'rxjs';

import { CustomDataBarchartPage } from './custom-data-barchart.page';

describe('CustomDataBarchartPage', () => {
  let component: CustomDataBarchartPage;
  let fixture: ComponentFixture<CustomDataBarchartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDataBarchartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              data: [],
              hollowArray: []
            })
          }
        },
        { provide: SocialSharing, useValue: socialSharingSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDataBarchartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
