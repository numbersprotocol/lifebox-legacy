import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NavController, LoadingController } from '@ionic/angular';
import { navControllerSpy } from '../../../mocks/angular/nav-controller';
import { loadingControllerSpy } from '../../../mocks/angular/loading-controller';
import { File } from '@ionic-native/file/ngx';
import { fileSpy } from '../../../mocks/native/file';

import { LoginPage } from './login.page';
import { RestService } from '../../services/rest/rest.service';
import { restServiceSpy } from '../../services/rest/rest.service.mock';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: File, useValue: fileSpy },
        { provide: RestService, useValue: restServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
