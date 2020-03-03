import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataReportComponent } from 'src/app/components/data-report/data-report.component';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-journal-daily-report',
  templateUrl: './journal-daily-report.page.html',
  styleUrls: ['./journal-daily-report.page.scss'],
})
export class JournalDailyReportPage implements OnInit {
  @ViewChild(DataReportComponent) dataReportComponent: DataReportComponent;
  date: Date;
  dateString: string;
  text = {
    activity: '',
  };
  subscriptions = new Subscription();

  constructor(
    private language: LanguageService,
    private route: ActivatedRoute,
  ) {
    this.subscribeText();
  }

  ngOnInit() {
    this.language.updateText();
    this.route.queryParams.subscribe(params => {
      this.date = new Date(params.date);
      this.dateString = params.date;
    });
  }

  ionViewWillEnter() {
    this.dataReportComponent.loadJournalPage(this.date);
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.journal.activity.get()
    .subscribe(res => this.text.activity = res));
  }

}
