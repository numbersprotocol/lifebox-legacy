import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SharePopUpPage } from '../share-pop-up/share-pop-up';
import { AddNewDataClassPage } from '../add-new-data-class/add-new-data-class';
import { CaloriesPage } from '../calories/calories';
import { StepsPage } from '../steps/steps';
import { LocationPage } from '../location/location';
import { WalkWithNiniPage } from '../walk-with-nini/walk-with-nini';
import { WeatherService } from '../../providers/weather/weather.service';
import { AirQualityService } from '../../providers/airquality/airquality.service';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { getRepository, Repository } from 'typeorm';
import { DatabarchartPage } from '../databarchart/databarchart'
import { CustomDatabarchartPage } from '../custom-databarchart/custom-databarchart'

import { DataService } from '../../providers/data/data.service';
import { SensorService } from '../../providers/sensor/sensor.service';

import { AirQualityReport, IodoorReport, SleepActivityReport, WeatherReport } from '../../types/report.type';
import { DataRenderService,  } from '../../providers/data-render/data-render.service';
import { CustomClassRecordEntity } from '../../entities/customClassRecord.entity';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  weatherReport: WeatherReport = {
    weatherTempCelsius: 0,
    weatherTempCelsiusDiff: 'N/A',
    weatherHumidity: 0,
    weatherHumidityDiff: '-'
  };
  airQualityReport: AirQualityReport = {
    airQualityIndex: 0,
    airQualityIndexDiff: '-',
    airQualityStatus: ''
  }
  sleepActivityReport: SleepActivityReport = {
    wokeupTime:'- - : - -',
    sleepTime: '- -'
  }
  steps:string = '- -';
  iodoorReport: IodoorReport = {
    indoorPercent: '- -',
    outdoorPercent: '- -'
  }

  customClasses: any;
  customClassRepo: Repository<CustomClassEntity>;
  customClassRecordRepo: Repository<CustomClassRecordEntity>;

  constructor(public dataService: DataService,
              private dataRenderService: DataRenderService,
              public navCtrl: NavController,
              public sensorService: SensorService,
              public weatherService: WeatherService,
              public airQualityService: AirQualityService,
              public zone: NgZone) {

  }

  async ngOnInit() {
    this.customClassRepo = getRepository(CustomClassEntity);
    this.customClassRecordRepo = getRepository(CustomClassRecordEntity);
  }

  async ionViewDidLoad() {
    await this.dataService.addCUstomizeClassData();
    this.sensorService.updateLocationSensorStatus();
    this.sensorService.updatePedometerSensorStatus();
    this.sensorService.updateGyroscopeSensorStatus();
    this.customClasses = await this.dataService.getCustomClassData();
  }

  async ionViewWillEnter() {
    this.loadPage();
  }

  doRefresh(event) {
    this.loadPage().then(() => {
      console.log('Page refreshed.');
      event.complete();
    });
  }

  fetchCustomClasses() {
    return this.customClassRepo
    .createQueryBuilder('customClass')
    .leftJoinAndSelect(
      'customClass.records',
      'custom_class_record_entity'
    )
    .orderBy('custom_class_record_entity_id', 'DESC')
    .getMany()
  }

  async increaseCustomClassRecord(customClass: CustomClassEntity) {
    this.dataService.modifyLatestCustomClassRecord(customClass, customClass.interval);
  }

  async decreaseCustomClassRecord(customClass: CustomClassEntity) {
    this.dataService.modifyLatestCustomClassRecord(customClass, - customClass.interval);
  }

  async loadPage() {
    return new Promise(resolve => {
      let date = new Date();
      Promise.all([
        this.updateAirQuality(),
        this.updateCustomClassRecords(),
        this.updateIodoor(date),
        this.updateSleepActivity(date),
        this.updateSteps(date),
        this.updateWeather(),
      ]).then(() => resolve()).catch(() => resolve());
    });
  }

  async updateAirQuality() {
    return new Promise((resolve, reject) => {
      this.zone.run(async() => {
        try {
          await this.airQualityService.fetchCurrentAirQuality()
        }
        catch(e) {
          console.log('updateAirQuality exception: ', e);
        }
        this.airQualityService.getAqiCache().then(res => {
          this.airQualityReport.airQualityIndex = res['aqi'];
          this.airQualityReport.airQualityIndexDiff = res['aqiDiff'];
          this.airQualityReport.airQualityStatus = res['status'];
          resolve();
        }).catch(e => reject(e));
      });
    });
  }

  async updateCustomClassRecords() {
    let _customClasses = await this.dataService.getCustomClassData();
    console.log('custom classes: ', _customClasses);
    let today = new Date().setHours(0, 0, 0, 0);

    for (var i = 0; i < _customClasses.length; i++) {
      if (_customClasses[i].records[0].dateTimeStamp < today) {
        let newRecord = new CustomClassRecordEntity();
        newRecord.class = _customClasses[i];
        newRecord.value = null;
        newRecord.dateTimeStamp = new Date().getTime();
        await this.customClassRecordRepo.save(newRecord);
      }
    }
  }

  async updateIodoor(date: Date) {
    return new Promise((resolve, reject) => {
      this.zone.run(async() => {
        this.dataRenderService.getIodoorReport(date).then(res => {
          this.iodoorReport = res;
          resolve();
        }).catch(e => reject(e));
      });
    });
  }

  async updateSleepActivity(date: Date) {
    return new Promise((resolve, reject) => {
      this.zone.run(async() => {
        await this.dataService.generateSleepActivityData();
        this.dataRenderService.getSleepActivityReport(date).then(res => {
            this.sleepActivityReport = res;
            resolve();
        }).catch(e => reject(e));
      });
    });
  }

  async updateSteps(date: Date) {
    return new Promise((resolve, reject) => {
      this.zone.run(async() => {
        this.dataRenderService.getSteps(date).then(res => {
          this.steps = res;
          resolve();
        }).catch(e => reject(e));
      });
    });
  }

  async updateWeather() {
    return new Promise((resolve, reject) => {
      this.zone.run(async() => {
        try {
          await this.weatherService.fetchCurrentWeather();
        }
        catch(e) {
          console.log('updateWeather exception: ', e);
        }
        this.weatherService.getWeatherCache().then(res => {
            this.weatherReport.weatherHumidity = res['humidity'];
            this.weatherReport.weatherHumidityDiff = res['humidityDiff'];
            this.weatherReport.weatherTempCelsius = res['tempCelsius'];
            this.weatherReport.weatherTempCelsiusDiff = res['tempCelsiusDiff'];
            resolve();
        }).catch(e => reject(e));
      });
    });
  }

  goToSharePopUp(params){
    if (!params) params = {};
    this.navCtrl.push(SharePopUpPage);
  }goToHome(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }goToAddNewDataClass(params){
    if (!params) params = {};
    this.navCtrl.push(AddNewDataClassPage);
  }goToLocation(params){
    if (!params) params = {};
    this.navCtrl.push(LocationPage);
  }goToSteps(params){
    if (!params) params = {};
    this.navCtrl.push(StepsPage);
  }goToCalories(params){
    if (!params) params = {};
    this.navCtrl.push(CaloriesPage);
  }goToWalkWithNini(params){
    if (!params) params = {};
    this.navCtrl.push(WalkWithNiniPage);
  }
  goToSevenDaysIndoor(params){
    this.dataService.getIodoorByDate(new Date(), 7)
    .then((res) => {
      this.navCtrl.push(DatabarchartPage, {"data": res[0].map(d => Math.round(d * 10) / 10),
                                           "class": "Indoor",
                                           "type": "value",
                                           "unit": "%",
                                           "barColor": "#364C59",
                                           "hollowArray": res[2]});
    });
  }
  goToSevenDaysOutdoor(params){
    this.dataService.getIodoorByDate(new Date(), 7)
    .then((res) => {
      this.navCtrl.push(DatabarchartPage, {"data": res[1].map(d => Math.round(d * 10) / 10),
                                           "class": "Outdoor",
                                           "type": "value",
                                           "unit": "%",
                                           "barColor": "#76A6A1",
                                           "hollowArray": res[2]});
    });
  }
  goToTemperature(){
    this.dataService.getWeatherByDate(new Date(), 7)
    .then((res) => {
      this.navCtrl.push(DatabarchartPage, {"data": res[0].map(d => Math.round(d * 10) / 10),
                                           "class": "Temp",
                                           "type": "value",
                                           "unit": "°C",
                                           "barColor": "#BF1B1B",
                                           "hollowArray": res[2]});
    });
  }
  goToAQI(){
    this.dataService.getAQIByDate(new Date(), 7)
    .then((res) => {
      this.navCtrl.push(DatabarchartPage, {"data": res[0].map(d => Math.round(d * 10) / 10),
                                           "class": "AQI",
                                           "type": "value",
                                           "unit": "",
                                           "barColor": "#F2B138",
                                           "hollowArray": res[1]});
    });
  }
  goToHumidity(){
    this.dataService.getWeatherByDate(new Date(), 7)
    .then((res) => {
      this.navCtrl.push(DatabarchartPage, {"data": res[1].map(d => Math.round(d * 10) / 10),
                                           "class": "RH",
                                           "type": "value",
                                           "unit": "%",
                                           "barColor": "#549FBF",
                                           "hollowArray": res[2]});
    });
  }
  goToWokeupTime(){
    this.dataService.getSleepByDate(new Date(), 7)
    .then((res) => {
      this.navCtrl.push(DatabarchartPage, {"data": res[0],
                                           "class": "Woke-up Time",
                                           "type": "time-point",
                                           "barColor": "#827A78",
                                           "hollowArray": res[2]});
    });
  }
  goToSleepingTime(){
    this.dataService.getSleepByDate(new Date(), 7)
    .then((res) => {
      this.navCtrl.push(DatabarchartPage, {"data": res[1].map(d => Math.round(d * 10) / 10),
                                           "class": "Sleeping Time",
                                           "type": "value",
                                           "unit": "hours",
                                           "barColor": "#3E303D",
                                           "hollowArray": res[2]});
    });
  }

  goToCustomClass(classID, className, classUnit, classMin, classMax){
    this.dataService.getSingleCustomClassDataByDate(new Date(), 7, classID)
    .then((res) => {
      this.navCtrl.push(CustomDatabarchartPage, {"data": res[0].map(d => Math.round(d * 10) / 10),
                                                 "class": `${className}`,
                                                 "type": "value",
                                                 "unit": `${classUnit}`,
                                                 "min": classMin,
                                                 "max": classMax,
                                                 "barColor": "#FF7773",
                                                 "hollowArray": res[1]})
    })
  }
}
