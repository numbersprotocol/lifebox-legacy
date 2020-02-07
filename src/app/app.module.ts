import { AppVersion } from '@ionic-native/app-version/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgModule, ErrorHandler } from '@angular/core';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { HomePage } from '../pages/home/home';
import { KeyGenerationPage } from '../pages/key-generation/key-generation';
import { AddNewDataClassPage } from '../pages/add-new-data-class/add-new-data-class';
import { WalkWithNiniPage } from '../pages/walk-with-nini/walk-with-nini';
import { CaloriesPage } from '../pages/calories/calories';
import { Calories0509Page } from '../pages/calories-0509/calories-0509';
import { StepsPage } from '../pages/steps/steps';
import { LocationPage } from '../pages/location/location';
import { LoginPage } from '../pages/login/login';
import { JournalPage } from '../pages/journal/journal';
import { JournalBarchartPage } from '../pages/journal-barchart/journal-barchart';
import { JournalDailyReportPage } from '../pages/journal-daily-report/journal-daily-report';
import { JournalScatterchartPage } from '../pages/journal-scatterchart/journal-scatterchart';
import { FeedPage } from '../pages/feed/feed';
import { SharePopUpPage } from '../pages/share-pop-up/share-pop-up';
import { MyApp } from './app.component';
import { ControlCenterPage } from '../pages/control-center/control-center';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { AboutPage } from '../pages/about/about';
import { CameraPage } from '../pages/camera/camera';
import { ProfilePage } from '../pages/profile/profile';
import { WorkingInProgressPage } from '../pages/working-in-progress/working-in-progress';
import { TourPage } from '../pages/tour/tour';
import { ConfigService } from '../providers/config/config.service';
import { CommService } from '../providers/comm/comm.service';
import { DataService } from '../providers/data/data.service';
import { PhotoService } from './photo.service';
import { RestService } from '../providers/rest/rest.service';
import { SensorService } from '../providers/sensor/sensor.service';
import { VisualizationService } from '../providers/visualization/visualization.service';
import { VisualizationUtility } from '../providers/visualization/utility.service';
import { WeatherService } from '../providers/weather/weather.service';
import { AirQualityService } from '../providers/airquality/airquality.service';
import { DatetimeService } from '../providers/datetime/datetime.service';
import { DataProcessService } from '../providers/data-process/data-process.service';
import { DataRenderService } from '../providers/data-render/data-render.service';
import { WeeklyReportPage } from '../pages/weekly-report/weekly-report';
import { AccountSettingPage } from '../pages/account-setting/account-setting';
import { LocationVisualization0224Page } from '../pages/data-location/location-visualization-0224';
import { PedometerVisualization0224Page } from '../pages/data-pedometer/pedometer-visualization-0224';
import { SensorsPage } from '../pages/sensors/sensors';
import { DatabarchartPage } from '../pages/databarchart/databarchart'
import { CustomDatabarchartPage } from '../pages/custom-databarchart/custom-databarchart'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@NgModule({
  declarations: [
    MyApp,
    ControlCenterPage,
    TabsControllerPage,
    KeyGenerationPage,
    WalkWithNiniPage,
    FeedPage,
    SharePopUpPage,
    JournalBarchartPage,
    JournalScatterchartPage,
    JournalPage,
    JournalDailyReportPage,
    CaloriesPage,
    Calories0509Page,
    StepsPage,
    LoginPage,
    LocationPage,
    AddNewDataClassPage,
    HomePage,
    AboutPage,
    CameraPage,
    ProfilePage,
    WorkingInProgressPage,
    TourPage,
    WeeklyReportPage,
    AccountSettingPage,
    LocationVisualization0224Page,
    PedometerVisualization0224Page,
    SensorsPage,
    DatabarchartPage,
    CustomDatabarchartPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    IonicModule.forRoot(MyApp, {tabsHideOnSubPages: true}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ControlCenterPage,
    TabsControllerPage,
    KeyGenerationPage,
    AddNewDataClassPage,
    WalkWithNiniPage,
    JournalBarchartPage,
    JournalScatterchartPage,
    JournalPage,
    JournalDailyReportPage,
    FeedPage,
    SharePopUpPage,
    CaloriesPage,
    Calories0509Page,
    StepsPage,
    LoginPage,
    LocationPage,
    HomePage,
    AboutPage,
    CameraPage,
    ProfilePage,
    WorkingInProgressPage,
    TourPage,
    DatabarchartPage,
    CustomDatabarchartPage
  ],
  providers: [
    AppVersion,
    BackgroundGeolocation,
    Camera,
    CommService,
    ConfigService,
    DataService,
    Dialogs,
    File,
    ImagePicker,
    Geolocation,
    HTTP,
    File,
    Dialogs,
    RestService,
    Pedometer,
    Gyroscope,
    PhotoService,
    RestService,
    SensorService,
    SocialSharing,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StatusBar,
    VisualizationService,
    VisualizationUtility,
    WeatherService,
    AirQualityService,
    DatetimeService,
    DataProcessService,
    DataRenderService,
    Diagnostic
  ]
})
export class AppModule {}
