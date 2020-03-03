import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  text = {
    home: '',
    record: '',
    journal: '',
    feed: '',
  };
  subscriptions = new Subscription();

  constructor(
    private language: LanguageService,
  ) {
    this.subscribeText();
  }

  ngOnInit() {
    this.language.updateText();
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.tabs.home.get()
    .subscribe(res => this.text.home = res));
    this.subscriptions.add(this.language.text.tabs.record.get()
    .subscribe(res => this.text.record = res));
    this.subscriptions.add(this.language.text.tabs.journal.get()
    .subscribe(res => this.text.journal = res));
    this.subscriptions.add(this.language.text.tabs.feed.get()
    .subscribe(res => this.text.feed = res));
  }

}
