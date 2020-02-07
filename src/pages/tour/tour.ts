import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';


@Component({
  templateUrl: 'tour.html'
})

export class TourPage {
  slides = [
    {
      title: "<b>Let your data go</b>",
      description: "Let your data work for you",
      image: "assets/img/tour-p1.png",
    },
    {
      title: "<b>Monetization</b>",
      description: "Invest with your personal data",
      image: "assets/img/tour-p2.png",
    },
    {
      title: "<b>Full Control</b>",
      description: "Control and own your personal data",
      image: "assets/img/tour-p3.png",
    },
    {
      title: "<b>Transparency</b>",
      description: "Approve who can license your data",
      image: "assets/img/tour-p4.png",
    }
  ];
  ending = {
      title: "<b>Take Back Control</b>",
      description: "Data is here, let us help you<br>understand what it says",
      image: "assets/img/tour-p1.png",
  };

  constructor(public navCtrl: NavController) {
  }
  goToKeyGeneration(params){
    if (!params) params = {};
    this.navCtrl.push(LoginPage).then(() => {
      this.navCtrl.remove(this.navCtrl.getActive().index - 1);
    });;
  }
}
