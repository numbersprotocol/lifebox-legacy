import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ControlCenterPage } from '../control-center/control-center';
import { JournalPage } from '../journal/journal';
import { FeedPage } from '../feed/feed';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = HomePage;
  tab2Root: any = ControlCenterPage;
  tab3Root: any = JournalPage;
  tab4Root: any = FeedPage;
  constructor(public navCtrl: NavController) {
  }
  goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }
}
