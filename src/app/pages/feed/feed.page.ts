import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  text = {
    header: '',
    msg: '',
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
    this.subscriptions.add(this.language.text.feed.header.get()
    .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.feed.msg.get()
    .subscribe(res => this.text.msg = res));
  }

}
