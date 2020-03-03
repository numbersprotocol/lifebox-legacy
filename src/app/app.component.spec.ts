import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform, NavController } from '@ionic/angular';
import { platformSpy } from '../mocks/angular/platform';
import { navControllerSpy } from '../mocks/angular/nav-controller';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { appVersionSpy } from '../mocks/native/app-version';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { splashScreenSpy } from '../mocks/native/splash-screen';

import { AppComponent } from './app.component';
import { ConfigService } from './services/config/config.service';
import { configServiceSpy } from './services/config/config.service.mock';
import { RepoService } from './services/repo/repo.service';
import { repoServiceSpy } from './services/repo/repo.service.mock';
import { RestService } from './services/rest/rest.service';
import { restServiceSpy } from './services/rest/rest.service.mock';
import { SensorService } from './services/sensor/sensor.service';
import { sensorServiceSpy } from './services/sensor/sensor.service.mock';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Platform, useValue: platformSpy },
        { provide: AppVersion, useValue: appVersionSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: RepoService, useValue: repoServiceSpy },
        { provide: RestService, useValue: restServiceSpy },
        { provide: SensorService, useValue: sensorServiceSpy }
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformSpy.ready();
    expect(repoServiceSpy.init).toHaveBeenCalled();
    await repoServiceSpy.init();
    await app.redirectInitPage(configServiceSpy);
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!

});
