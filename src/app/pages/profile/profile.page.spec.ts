import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoadingController, IonicModule } from '@ionic/angular';
import { loadingControllerSpy } from '../../../mocks/angular/loading-controller';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { imagePickerSpy } from '../../../mocks/native/image-picker';

import { ProfilePage } from './profile.page';
import { RestService } from '../../services/rest/rest.service';
import { restServiceSpy } from '../../services/rest/rest.service.mock';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: ImagePicker, useValue: imagePickerSpy },
        { provide: RestService, useValue: restServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
