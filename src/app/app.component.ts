import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import ZeroClientProvier from 'web3-provider-engine';

import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { WorkingInProgressPage } from '../pages/working-in-progress/working-in-progress';
import { TourPage } from '../pages/tour/tour';

import { ConfigService } from '../providers/config/config.service';
import { SensorService } from '../providers/sensor/sensor.service';

import { DataService } from '../providers/data/data.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  version:string = '';

  @ViewChild(Nav) navCtrl: Nav;
    /* NOTE: Use Tour as default page
     *
     *   We might change main page (TabsControllerPage) as default
     *   after the app is mature.
     */
    //rootPage:any = TabsControllerPage;
    //rootPage: any = TourPage;

  web3Provider: ZeroClientProvier;
  constructor(configService: ConfigService,
              dataService: DataService,
              platform: Platform,
              sensorService: SensorService,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private appVersion: AppVersion
              ) {
    this.appVersion.getVersionNumber()
      .then(res => {
        this.version = res;
        console.debug('app version');
        console.debug(this.version);
      })
      .catch(err => {
        console.warn('Failed to get app version');
      });

    platform.ready().then(async() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //await this.initOrm(platform);
      await dataService.init();
      await this.setDefaultRootPage(configService);
      sensorService.configureLocationWatcher();
      splashScreen.hide();
      statusBar.styleDefault();
      this.web3Provider = new ZeroClientProvier();
    });
  }

  async setDefaultRootPage(configService: ConfigService) {
    return new Promise(async(resolve, reject) => {
      if (await configService.isInitialized()) {
        this.navCtrl.setRoot(LoginPage);
        resolve(LoginPage);
      }
      else {
        await configService.createConfig();
        this.navCtrl.setRoot(TourPage);
        resolve(TourPage);
      }
    })
  }

  goToAbout(params){
    if (!params) params = {};
    this.navCtrl.push(AboutPage);
  }
  goToWorkInProgress(params){
    if (!params) params = {};
    this.navCtrl.push(WorkingInProgressPage);
  }
  goToProfile(params){
    if (!params) params = {};
    this.navCtrl.push(ProfilePage);
  }
  goToHelp(params){
    if (!params) params = {};
    this.navCtrl.push(TourPage);
  }
  goToLogin(params){
    if (!params) params = {};
    localStorage.removeItem('session-uid');
    localStorage.removeItem('web3Token');
    this.navCtrl.setRoot(LoginPage).then(() => {
      this.navCtrl.popToRoot();
    });
  }
}
