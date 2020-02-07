import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JournalPage } from '../journal/journal';

@Component({
  selector: 'page-weekly-report',
  templateUrl: 'weekly-report.html'
})
export class WeeklyReportPage {

  constructor(public navCtrl: NavController) {
  }
  goToJournal(params){
    if (!params) params = {};
    this.navCtrl.push(JournalPage);
  }goToWeeklyReport(params){
    if (!params) params = {};
    this.navCtrl.push(WeeklyReportPage);
  }
}
