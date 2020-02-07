import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WeeklyReportPage } from '../weekly-report/weekly-report';
import { JournalBarchartPage } from '../journal-barchart/journal-barchart';
import { JournalScatterchartPage } from '../journal-scatterchart/journal-scatterchart';
import { JournalDailyReportPage} from '../journal-daily-report/journal-daily-report';

import { DataService } from '../../providers/data/data.service';

@Component({
  selector: 'page-journal',
  templateUrl: 'journal.html'
})
export class JournalPage {
  reportDates: any;
  constructor(private dataService: DataService,
              public navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.dataService.getDateWithAvailableData().then((res) => {
      this.reportDates = res;
    });
  }

  goToWeeklyReport(params){
    if (!params) params = {};
    this.navCtrl.push(WeeklyReportPage);
  }
  goToJournal(params){
    if (!params) params = {};
    this.navCtrl.push(JournalPage);
  }
  goToJournalBarchart(params){
    if (!params) params = {};
    this.navCtrl.push(JournalBarchartPage);
  }
  goToJournalScatterchart(params){
    if (!params) params = {};
    this.navCtrl.push(JournalScatterchartPage);
  }
  goToJournalDailyReport(reportDate){
    this.navCtrl.push(JournalDailyReportPage, {
      date: reportDate
    });
  }
}
