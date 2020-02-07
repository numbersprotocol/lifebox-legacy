import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SharePopUpPage } from '../share-pop-up/share-pop-up';
import { Calories0509Page } from '../calories-0509/calories-0509';

import { Repository } from 'typeorm';

import { DataService } from '../../providers/data/data.service';

import { CustomClassEntity } from '../../entities/customClass.entity';
import { IodoorDataEntity, SleepActivityEntity, StepsDataEntity } from '../../entities/daily-data.entity';

@Component({
  selector: 'page-journal-daily-report',
  templateUrl: 'journal-daily-report.html',
})
export class JournalDailyReportPage {
  date:Date;
  dateString:string;
  dailySteps:string;
  indoorPercent:string;
  outdoorPercent:string;
  weatherTempCelsius:Number = 0;
  weatherTempCelsiusDiff:string = 'N/A';
  weatherHumidity:Number = 0;
  weatherHumidityDiff:string = '-';
  airQualityIndex:Number = 0;
  airQualityIndexDiff:string = '-';
  airQualityStatus:string = '';
  customClasses: any;
  customClassRepo: Repository<CustomClassEntity>;
  wokeupTime:string = '';
  sleepTime: string;

  constructor(private dataService: DataService,
              public navCtrl: NavController,
              public navParams: NavParams,
              private zone: NgZone) {
    this.dateString = this.navParams.get('date');
    this.date = new Date(this.dateString);
  }

  async ionViewWillEnter() {
    this.dataService.getDailyStepsData(this.date)
    .then((dailySteps: StepsDataEntity) => {
      this.updateDailySteps(dailySteps.steps);
    }).catch(() => this.updateDailySteps(0));

    this.dataService.getDailyIodoorData(this.date)
    .then((dailyIodoor: IodoorDataEntity) => {
      if (dailyIodoor) {
        this.updateIodoor(dailyIodoor);
      }
    }).catch(e => console.log(e));

    this.dataService.generateSleepActivityData(this.date)
    .then(() => {
      this.dataService.getDailySleepActivity(this.date)
      .then((data: SleepActivityEntity) => {
        this.updateWokeupTime(data.wokeupTimestamp);
        this.updateSleepTime(data.sleepDuration);
      })
    }).catch(() => {
      this.updateWokeupTime(0);
      this.updateSleepTime(0);
    })
  }

  async updateIodoor(dailyIodoor: IodoorDataEntity) {
    return new Promise(resolve => {
      console.log('dailyIodoor ', dailyIodoor);
      this.zone.run(() => {
        if (dailyIodoor.indoorPercent  == 0 && dailyIodoor.outdoorPercent == 0){
          this.indoorPercent = '-'
          this.outdoorPercent = '-'

        }
        else {
          this.indoorPercent = `${dailyIodoor.indoorPercent}`;
          this.outdoorPercent = `${dailyIodoor.outdoorPercent}`;
          resolve(dailyIodoor);
        }
      })
    });
  }

  async updateDailySteps(dailySteps) {
    return new Promise(resolve => {
      this.zone.run(() => {
        if (dailySteps != 0){
          this.dailySteps = `${dailySteps}`;
          resolve(dailySteps);
        }
        else {
          this.dailySteps = '-'
        }
      });
    });
  }

  async updateWokeupTime(wokeupTimestamp) {
    return new Promise(resolve => {
      this.zone.run(() => {
        if (wokeupTimestamp != 0){
          let pre_wokeupTime = new Date(wokeupTimestamp)
          this.wokeupTime = `${pre_wokeupTime.getHours() <= 12 ? pre_wokeupTime.getHours() : pre_wokeupTime.getHours() - 12}:` +
                             `${pre_wokeupTime.getMinutes() < 10 ? '0' + pre_wokeupTime.getMinutes() : pre_wokeupTime.getMinutes()} ` +
                             `${pre_wokeupTime.getHours() < 12 ? 'AM' : 'PM'}`;
          resolve(wokeupTimestamp);
        } else {
          this.wokeupTime = '- - : - -';
        }
      });
    });
  }

  async updateSleepTime(sleepTime) {
    return new Promise(resolve => {
      this.zone.run(() => {
        if (sleepTime != 0){
          this.sleepTime = `${Math.round(sleepTime * 10) / 10}`;
          resolve(sleepTime);
        }
        else {
          this.sleepTime = '-'
        }
      });
    });
  }

  goToSharePopUp(params){
    if (!params) params = {};
    this.navCtrl.push(SharePopUpPage);
  }
  goToCalories0509(params){
    if (!params) params = {};
    this.navCtrl.push(Calories0509Page);
  }
}
