import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AddNewDataClassPage } from '../add-new-data-class/add-new-data-class';
import { CaloriesPage } from '../calories/calories';
import { WalkWithNiniPage } from '../walk-with-nini/walk-with-nini';

@Component({
  selector: 'page-share-pop-up',
  templateUrl: 'share-pop-up.html'
})
export class SharePopUpPage {

  constructor(public navCtrl: NavController) {
  }
  goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }goToSharePopUp(params){
    if (!params) params = {};
    this.navCtrl.push(SharePopUpPage);
  }goToAddNewDataClass(params){
    if (!params) params = {};
    this.navCtrl.push(AddNewDataClassPage);
  }goToCalories(params){
    if (!params) params = {};
    this.navCtrl.push(CaloriesPage);
  }goToWalkWithNini(params){
    if (!params) params = {};
    this.navCtrl.push(WalkWithNiniPage);
  }
}
