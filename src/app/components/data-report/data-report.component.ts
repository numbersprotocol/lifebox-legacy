import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { EnvService } from 'src/app/services/env/env.service';
import { DataService } from '../../services/data/data.service';
import { DataRenderService } from '../../services/data-render/data-render.service';
import { SensorService } from '../../services/sensor/sensor.service';
import { ActivatedRoute } from "@angular/router";
import { Storage } from '@ionic/storage';

import { CustomClassEntity } from '../../entities/customClass.entity';
import { DailyReport } from '../../models/daily-report.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-data-report',
  templateUrl: './data-report.component.html',
  styleUrls: ['./data-report.component.scss'],
})
export class DataReportComponent implements OnInit {
  report: DailyReport;
  text = {
    title: '',
    blood: '',
    body: '',
    event: '',
    config: '',
    temperature: '',
    AQ: '',
    AQI: '',
    humidity: '',
    wokeUpTime: '',
    sleepingTime: '',
    hrs: '',
    steps: '',
    indoor: '',
    outdoor: '',
    shareButton: '',
    weight: '體重',
    height: '身高',
    urine: '尿量',
    sugar: '血糖',
    heartbeat: "心跳",
    diastolic: "舒張壓",
    systolic: "收縮壓",
  };
  state={
    body:121212,
    height:0,
    weight:0,
    urine:0,
    sugar:0,
    heartbeat:0,
    diastolic:0,
    systolic:0,
  };
  p={};
  subscriptions = new Subscription();

  constructor(
    private dataService: DataService,
    private dataRenderService: DataRenderService,
    private envService: EnvService,
    private language: LanguageService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage,
    public changeDetectorRef:ChangeDetectorRef,
  ) {
    this.report = new DailyReport();
    this.subscribeText();
    
    this.storage.get('bloodData').then((p) => {
      this.p=p;
      this.state={
        body:12312313,
        weight: p.weight,
        height: p.height,
        urine: p.urine,
        sugar: p.sugar,
        heartbeat: p.heartbeat,
        diastolic: p.diastolic,
        systolic: 3332323,
      };
      this.changeDetectorRef.markForCheck();
this.changeDetectorRef.detectChanges();
      console.log('Your storage is update', p);
    });
//     this.changeDetectorRef.markForCheck();
// this.changeDetectorRef.detectChanges();
  //   this.route.queryParams.subscribe(p => {
  //     this.state={
  //       body:12312313,
  //       weight: p.weight,
  //       height: p.height,
  //       urine: p.urine,
  //       sugar: p.sugar,
  //       heartbeat: p.heartbeat,
  //       diastolic: p.diastolic,
  //       systolic: p.systolic,
  //     };
  // });      
  }

  ngOnInit() {
    this.language.updateText();
  }

  doRefresh(event) {
    this.loadHomePage().then(() => {
      event.target.complete();
    });
  }

  async increaseCustomClassRecord(customClass: CustomClassEntity) {
    this.dataService.modifyLatestCustomClassRecord(customClass, customClass.interval);
  }

  async decreaseCustomClassRecord(customClass: CustomClassEntity) {
    this.dataService.modifyLatestCustomClassRecord(customClass, - customClass.interval);
  }

  async loadHomePage() {
    await this.dataService.addCustomizeClassData();
    await this.dataService.generateSleepActivityData(new Date());
    this.report = await this.dataRenderService.reloadHomeReport();
    this.envService.fetchEnv().then(() => {
      this.dataRenderService.reloadHomeReport().then(res => {
        this.report = res;
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
    return Promise.resolve();
  }

  async loadJournalPage(date: Date) {
    this.report = await this.dataRenderService.reloadJournalReport(date);
    return Promise.resolve();
  }
  // let navigationExtras: NavigationExtras = this.state;
  // this.router.navigate(['destination-path'], navigationExtras);
  
  goToBloodData(classID, className, classUnit, classMin, classMax) {
    
    this.dataService.getSingleCustomClassDataByDate(new Date(), 7, classID)
      .then((res) => {
        console.log('SingleCustomClassData', res);
        let navigationExtras: NavigationExtras = {
          // queryParams: {
          //     // currency: JSON.stringify(currency),
          //     height:222,
          //     weight:222,
          //     urine:222,
          //     sugar:222,
          //     heartbeat:222,
          //     diastolic:222,
          //     systolic:222,
              
          // }
          queryParams: {
            // currency: JSON.stringify(currency),
            height:this.state.height,
            weight:this.state.weight,
            urine:this.state.urine,
            sugar:this.state.sugar,
            heartbeat:this.state.heartbeat,
            diastolic:this.state.diastolic,
            systolic:this.state.systolic,
        }
      };
        this.navCtrl.navigateForward(['/data-blood'],  navigationExtras);

        // this.navCtrl.navigateForward(['/data-blood'], {
        //   queryParams: {
        //     data: res[0].map(d => Math.round(d * 10) / 10),
        //     class: `${className}`,


        //     height:222,
        //     urine:222,
        //     sugar:222,
        //     heartbeat:222,
        //     diastolic:222,
        //     systolic:222,


        //     type: 'value',
        //     unit: `${classUnit}`,
        //     min: classMin,
        //     max: classMax,
        //     barColor: '#FF7773',
        //     hollowArray: res[1]
        //   }
        // });
      });
  }
  goToBody() {
    this.dataService.getBloodByDate()
      .then((res) => {
        this.navCtrl.navigateForward(['/set-body-data-class'], {
          queryParams: {
            data:' res[1].map(d => Math.round(d * 10) / 10),',
            class: 'Outdoor',
            height:this.state.height,
            weight:this.state.weight,

            urine:this.state.urine,
            sugar:this.state.sugar,
            heartbeat:this.state.heartbeat,
            diastolic:this.state.diastolic,
            systolic:this.state.systolic,
            type: 'value',
            unit: '%',
            barColor: '#76A6A1',
            hollowArray: res[2]
          }
        });
      });
  }

  goToBody2() {
    this.dataService.getIodoorByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/set-body-data-class'], {
          queryParams: {
            data: res[1].map(d => Math.round(d * 10) / 10),
            class: 'Outdoor',
            type: 'value',
            unit: '%',
            barColor: '#76A6A1',
            hollowArray: res[2]
          }
        });
      });
  }
  goToSevenDaysIndoor() {
    this.dataService.getIodoorByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/data-barchart'], {
          queryParams: {
            data: res[0].map(d => Math.round(d * 10) / 10),
            class: 'Indoor',
            type: 'value',
            unit: '%',
            barColor: '#364C59',
            hollowArray: res[2]
          }
        }
        );
      });
  }

  goToSevenDaysOutdoor() {
    this.dataService.getIodoorByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/data-barchart'], {
          queryParams: {
            data: res[1].map(d => Math.round(d * 10) / 10),
            class: 'Outdoor',
            type: 'value',
            unit: '%',
            barColor: '#76A6A1',
            hollowArray: res[2]
          }
        });
      });
  }

  goToTemperature() {
    this.dataService.getWeatherByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/data-barchart'], {
          queryParams: {
            data: res[0].map(d => Math.round(d * 10) / 10),
            class: 'Temp',
            type: 'value',
            unit: '°C',
            barColor: '#BF1B1B',
            hollowArray: res[2]
          }
        });
      });
  }
  goToAQI() {
    this.dataService.getAQIByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/data-barchart'], {
          queryParams: {
            data: res[0].map(d => Math.round(d * 10) / 10),
            class: 'AQI',
            type: 'value',
            unit: '',
            barColor: '#F2B138',
            hollowArray: res[1]
          }
        });
      });
  }
  goToHumidity() {
    this.dataService.getWeatherByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/data-barchart'], {
          queryParams: {
            data: res[1].map(d => Math.round(d * 10) / 10),
            class: 'RH',
            type: 'value',
            unit: '%',
            barColor: '#549FBF',
            hollowArray: res[2]
          }
        });
      });
  }
  goToWokeupTime() {
    this.dataService.getSleepByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/data-barchart'], {
          queryParams: {
            data: res[0],
            class: 'Woke-up Time',
            type: 'time-point',
            barColor: '#827A78',
            hollowArray: res[2]
          }
        });
      });
  }
  goToSleepingTime() {
    this.dataService.getSleepByDate(new Date(), 7)
      .then((res) => {
        this.navCtrl.navigateForward(['/data-barchart'], {
          queryParams: {
            data: res[1].map(d => Math.round(d * 10) / 10),
            class: 'Sleeping Time',
            type: 'value',
            unit: 'hours',
            barColor: '#3E303D',
            hollowArray: res[2]
          }
        });
      });
  }

  goToSteps() {
    this.navCtrl.navigateForward(['/steps']);
  }

  goToCustomClass(classID, className, classUnit, classMin, classMax) {
    this.dataService.getSingleCustomClassDataByDate(new Date(), 7, classID)
      .then((res) => {
        console.log('SingleCustomClassData', res);
        this.navCtrl.navigateForward(['/custom-data-barchart'], {
          queryParams: {
            data: res[0].map(d => Math.round(d * 10) / 10),
            class: `${className}`,
            type: 'value',
            unit: `${classUnit}`,
            min: classMin,
            max: classMax,
            barColor: '#FF7773',
            hollowArray: res[1]
          }
        });
      });
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.home.title.get()
      .subscribe(res => this.text.title = res));
    this.subscriptions.add(this.language.text.home.blood.get()
      .subscribe(res => this.text.blood = res));
    this.subscriptions.add(this.language.text.home.body.get()
      .subscribe(res => this.text.body = res));
    this.subscriptions.add(this.language.text.home.event.get()
      .subscribe(res => this.text.event = res));
    this.subscriptions.add(this.language.text.home.config.get()
      .subscribe(res => this.text.config = res));

    this.subscriptions.add(this.language.text.dataReport.temperature.get()
      .subscribe(res => this.text.temperature = res));
    this.subscriptions.add(this.language.text.dataReport.AQ.get()
      .subscribe(res => this.text.AQ = res));
    this.subscriptions.add(this.language.text.dataReport.AQI.get()
      .subscribe(res => this.text.AQI = res));
    this.subscriptions.add(this.language.text.dataReport.humidity.get()
      .subscribe(res => this.text.humidity = res));
    this.subscriptions.add(this.language.text.dataReport.wokeUpTime.get()
      .subscribe(res => this.text.wokeUpTime = res));
    this.subscriptions.add(this.language.text.dataReport.sleepingTime.get()
      .subscribe(res => this.text.sleepingTime = res));
    this.subscriptions.add(this.language.text.dataReport.hrs.get()
      .subscribe(res => this.text.hrs = res));
    this.subscriptions.add(this.language.text.dataReport.steps.get()
      .subscribe(res => this.text.steps = res));
    this.subscriptions.add(this.language.text.dataReport.indoor.get()
      .subscribe(res => this.text.indoor = res));
    this.subscriptions.add(this.language.text.dataReport.outdoor.get()
      .subscribe(res => this.text.outdoor = res));
    this.subscriptions.add(this.language.text.dataReport.shareButton.get()
      .subscribe(res => this.text.shareButton = res));
  }

}
