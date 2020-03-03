import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NavController, LoadingController, IonicModule } from '@ionic/angular';
import { navControllerSpy } from '../../../mocks/angular/nav-controller';
import { loadingControllerSpy } from '../../../mocks/angular/loading-controller';
import { File } from '@ionic-native/file/ngx';
import { fileSpy } from '../../../mocks/native/file';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { dialogsSpy } from '../../../mocks/native/dialogs';

import { KeyGenerationPage } from './key-generation.page';
import { RestService } from '../../services/rest/rest.service';
import { restServiceSpy } from '../../services/rest/rest.service.mock';


describe('KeyGenerationPage', () => {
  let component: KeyGenerationPage;
  let fixture: ComponentFixture<KeyGenerationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyGenerationPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: File, useValue: fileSpy },
        { provide: Dialogs, useValue: dialogsSpy },
        { provide: RestService, useValue: restServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyGenerationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
