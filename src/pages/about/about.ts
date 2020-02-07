import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { NavController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';  

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {
  }
  goToMain(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }  
  goToTabController(params){
    if (!params) params = {};
    this.navCtrl.push(TabsControllerPage);
  }  
}
