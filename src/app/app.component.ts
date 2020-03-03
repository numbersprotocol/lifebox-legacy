import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import ZeroClientProvider from 'web3-provider-engine';

import { environment } from 'src/environments/environment';
import { ConfigService } from './services/config/config.service';
import { Subscription } from 'rxjs';
import { LanguageService } from './services/language/language.service';
import { LoginService } from './services/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  version = '';
  web3Provider = new ZeroClientProvider();
  menuItems = [
    { text: 'Profile', link: '/profile' },
    // { text: 'Privacy', link: '/work-in-progress' },
    // { text: 'About', link: '/about' },
    { text: 'Help', link: '/tour' }
  ];
  text = {
    header: '',
    version: '',
    signOutButton: '',
  };
  subscriptions = new Subscription();

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private splashScreen: SplashScreen,
    private appVersion: AppVersion,
    private configService: ConfigService,
    private language: LanguageService,
    public loginService: LoginService,
  ) {
    this.subscribeText();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.getAppVersion().then(version => this.version = version);
      this.setupDevToolsPage();
      await this.language.setLanguage(this.configService.getLanguage());
      await this.redirectInitPage().then(() => this.splashScreen.hide());
    });
  }

  async getAppVersion() {
    return this.appVersion.getVersionNumber();
  }

  async redirectInitPage() {
    if (!await this.configService.configExists()) {
      await this.configService.createConfig();
      return this.navCtrl.navigateRoot(['/tour'], {skipLocationChange: true});
    }
    await this.configService.loadConfig();
    if (await this.loginService.quickLogin()) {
      return this.navCtrl.navigateRoot(['/tabs'], {replaceUrl: true});
    }
    return this.navCtrl.navigateRoot(['/login'], {skipLocationChange: true});
  }

  setupDevToolsPage() {
    if (environment.production === true) {
      return;
    }
    this.menuItems.push({
      text: 'Dev Tools',
      link: '/dev-tools',
    });
  }

  signOut() {
    this.loginService.signOut();
    this.navCtrl.navigateRoot(['/login'], {skipLocationChange: true});
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.sideMenu.header.get()
    .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.sideMenu.profile.get()
    .subscribe(res => this.menuItems[0].text = res));
    this.subscriptions.add(this.language.text.sideMenu.help.get()
    .subscribe(res => this.menuItems[1].text = res));
    this.subscriptions.add(this.language.text.sideMenu.version.get()
    .subscribe(res => this.text.version = res));
    this.subscriptions.add(this.language.text.sideMenu.signOutButton.get()
    .subscribe(res => this.text.signOutButton = res));
  }
}
