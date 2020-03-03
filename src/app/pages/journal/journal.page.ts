import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { DataService } from '../../services/data/data.service';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  reportDates: any;
  text = {
    header: '',
  };
  subscriptions = new Subscription();

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private language: LanguageService,
  ) {
    this.subscribeText();
  }

  ngOnInit() {
    this.language.updateText();
  }

  ionViewWillEnter() {
    this.dataService.getDateWithAvailableData().then((res) => {
      this.reportDates = res;
    });
  }

  goToJournalDailyReport(reportDate) {
    this.navCtrl.navigateForward(
      ['/journal-daily-report'],
      { queryParams: { date: reportDate } }
    );
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.home.header.get()
    .subscribe(res => this.text.header = res));
  }
}
