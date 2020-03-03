import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SensorService } from '../../services/sensor/sensor.service';
import { DataReportComponent } from 'src/app/components/data-report/data-report.component';
import { LanguageService } from 'src/app/services/language/language.service';
import { Subscription } from 'rxjs';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RepoService } from 'src/app/services/repo/repo.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(DataReportComponent) dataReportComponent: DataReportComponent;
  text = {
    header: '',
    title: '',
    addDataClassButton: '',
  };
  subscriptions = new Subscription();
  isInitialized: Promise<{}>;

  constructor(
    private language: LanguageService,
    private loading: LoadingService,
    private logger: LoggerService,
    private sensorService: SensorService,
    private repoService: RepoService,
  ) {
    this.subscribeText();
  }

  ngOnInit() {
    this.language.updateText();
    this.isInitialized = this.init();
    this.loading.general(this.isInitialized);
  }

  // FIXME: Data loading should be done using Observable subscription instead
  ionViewDidEnter() {
    this.isInitialized.then(() => {
      this.loading.general(this.dataReportComponent.loadHomePage());
    });
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async init() {
    return this.repoService.init()
    .then(() => {
      return Promise.all([
        this.logger.registerErrorLogNotification(),
        this.initSensors(),
        this.dataReportComponent.loadHomePage(),
      ]);
    });
  }

  initSensors() {
    this.sensorService.configureLocationWatcher();
    return Promise.all([
      this.sensorService.updateLocationSensorStatus(),
      this.sensorService.updatePedometerSensorStatus(),
      this.sensorService.updateGyroscopeSensorStatus(),
    ]);
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.home.header.get()
    .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.home.title.get()
    .subscribe(res => this.text.title = res));
    this.subscriptions.add(this.language.text.dataReport.addCustomClassButton.get()
    .subscribe(res => this.text.addDataClassButton = res));
  }

}
