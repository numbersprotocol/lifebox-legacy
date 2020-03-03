import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  keyExists = false;
  text = {
    header: '',
    button: '',
    createKeyButton: '',
  };
  subscriptions = new Subscription();

  constructor(
    private language: LanguageService,
    private loadingController: LoadingController,
    private loginService: LoginService,
    private navCtrl: NavController,
  ) {
    this.subscribeText();
  }

  ngOnInit() {
    this.language.updateText();
  }

  async login() {
    await this.presentLoading();
    const loginResult = await this.loginService.login();
    await this.dismissLoading();
    if (loginResult !== true) {
      return;
    }
    this.navCtrl.navigateRoot(['/tabs'], {replaceUrl: true});
  }

  async presentLoading() {
    const loader = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loader.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.login.header.get()
    .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.login.button.get()
    .subscribe(res => this.text.button = res));
    this.subscriptions.add(this.language.text.login.createKeyButton.get()
    .subscribe(res => this.text.createKeyButton = res));
  }

}
