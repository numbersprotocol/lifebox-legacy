import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { NavController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';  

@Component({
  selector: 'page-working-in-progress',
  templateUrl: 'working-in-progress.html'
})
export class WorkingInProgressPage {

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
