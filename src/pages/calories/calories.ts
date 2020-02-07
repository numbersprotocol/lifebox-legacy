import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SharePopUpPage } from '../share-pop-up/share-pop-up';
import { HomePage } from '../home/home';
import { AddNewDataClassPage } from '../add-new-data-class/add-new-data-class';
import { WalkWithNiniPage } from '../walk-with-nini/walk-with-nini';

@Component({
  selector: 'page-calories',
  templateUrl: 'calories.html'
})
export class CaloriesPage {

  constructor(public navCtrl: NavController) {
  }
  goToSharePopUp(params){
    if (!params) params = {};
    this.navCtrl.push(SharePopUpPage);
  }goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
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
