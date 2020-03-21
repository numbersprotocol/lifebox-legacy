import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClientXsrfModule,HttpClient } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { File } from '@ionic-native/file/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CommService } from './services/comm/comm.service';
import { ConfigService } from './services/config/config.service';
import { DataService } from './services/data/data.service';
import { DataProcessService } from './services/data-process/data-process.service';
import { DataRenderService } from './services/data-render/data-render.service';
import { DatetimeService } from './services/datetime/datetime.service';
import { RestService } from './services/rest/rest.service';
import { SensorService } from './services/sensor/sensor.service';
import { VisualizationService } from './services/visualization/visualization.service';
import { VisualizationUtilityService } from './services/visualization/visualization-utility.service';
import { RepoService } from './services/repo/repo.service';
import { EnvService } from './services/env/env.service';
import { LanguageService } from './services/language/language.service';
import { ErrorHandlerService } from './services/error-handler/error-handler.service';
import { LoggerService } from './services/logger/logger.service';
import { ToastService } from './services/toast/toast.service';
import { LoginService } from './services/login/login.service';
import { DialogService } from './services/dialog/dialog.service';





export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    AppVersion,
    BackgroundGeolocation,
    Dialogs,
    Diagnostic,
    File,
    ImagePicker,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    AndroidPermissions,
    Geolocation,
    LocationAccuracy,
    Gyroscope,
    Pedometer,
    SocialSharing,
    CommService,
    ConfigService,
    DataService,
    DataProcessService,
    DataRenderService,
    DatetimeService,
    EnvService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    LoggerService,
    RepoService,
    RestService,
    SensorService,
    VisualizationService,
    VisualizationUtilityService,
    LanguageService,
    ToastService,
    LoginService,
    DialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
