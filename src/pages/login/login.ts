import { File } from '@ionic-native/file/ngx';
import { RestService } from './../../providers/rest/rest.service';
import { Component } from '@angular/core';
import { NavController, Loading, LoadingController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { KeyGenerationPage } from '../key-generation/key-generation';

// TODO: Put keyFile variable to global as global const
const keyFile: string = 'web3_key.json';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  keyExists: boolean = false;
  loader: Loading;

  constructor(public navCtrl: NavController,
              public restService: RestService,
              public file: File,
              public loadingController: LoadingController) {
  }

  ionViewWillEnter() {
    let sessionUid: number = +localStorage.getItem('session-uid');
    let token: string = localStorage.getItem('web3Token');
    console.log('Sessions: uid ', sessionUid, 'token: ', token);
    if (sessionUid && token) {
      this.presentLoading();
      this.restService.fastLogin(sessionUid, token)
      .then(() => {
        this.dismissLoading();
        this.navCtrl.push(TabsControllerPage).then(() => {
          this.navCtrl.remove(this.navCtrl.getActive().index - 1);
        });
      })
      .catch(_ => {
        this.dismissLoading();
        alert('Fast login failed');
        localStorage.removeItem('session-uid');
        localStorage.removeItem('web3Token');
      })
    }
  }

  ionViewDidLoad() {
    this.file.checkFile(this.file.dataDirectory, keyFile)
    .then(exist => {
      this.keyExists = exist;
    })
    .catch(_ => {
      this.keyExists = false;
    })
  }

  async login() {
    this.presentLoading();

    this.file.checkFile(this.file.dataDirectory, keyFile)
    .then(async _ => {
      await this.restService.login(keyFile)
      .then(uid => {
        this.dismissLoading();
        console.log('Login successfully, uid = ', uid);
        if (uid > 0) {
          this.navCtrl.setRoot(TabsControllerPage).then(() => {
            this.navCtrl.popToRoot();
          });
        } else {
          alert('Login failed');
        };
      })
      .catch(err => {
        this.dismissLoading();
        alert('Login failed.\nPlease check your Internet connectivity and try again.');
        console.log('Login error')
        console.log(err);
      });
    })
    .catch(err =>{
      console.log(err);
      alert('Login key is not found, please generate key first');
      this.dismissLoading();
      this.navCtrl.push(KeyGenerationPage).then(() => {
      });
    });
  }

  goToKeyGeneration(params){
    if (!params) params = {};
    this.navCtrl.push(KeyGenerationPage).then(() => {
    });
  }

  presentLoading() {
    this.loader = this.loadingController.create({
      content: 'Please wait...'
    });
    this.loader.present();
  }

  dismissLoading() {
    this.loader.dismiss();
  }
}
