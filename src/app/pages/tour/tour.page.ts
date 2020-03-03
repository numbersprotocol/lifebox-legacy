import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.page.html',
  styleUrls: ['./tour.page.scss'],
})
export class TourPage implements OnInit {
  slides = [
    {
      title: '<b>Lifebox Data Wallet</b>',
      description: `Record, control and share
      your personal data`,
      image: 'assets/img/tour-p1.png',
    },
    {
      title: '<b>Web 3.0 Login</b>',
      description: '',
      image: 'assets/img/tour-p2.png',
    },
    {
      title: '<b>Full Control</b>',
      description: `Collect and own
      your personal data.`,
      image: 'assets/img/tour-p3.png',
    },
    {
      title: '<b>Daily Activity</b>',
      description: `Control which data source you want
      to enable and even create customized
      data class`,
      image: 'assets/img/tour-p4.png',
    },
    {
      title: '<b>Journal & Visualization</b>',
      description: `Track historical data and see
      visualization of the data in past seven
      days.`,
      image: 'assets/img/tour-p5.png',
    },
  ];
  ending = {
    title: `<b>Ready to Start?
    Enjoy your Data Journey
    From Now!</b>`,
    description: '',
    image: 'assets/img/tour-p6.png',
  };

  constructor() { }

  ngOnInit() {
  }

}
