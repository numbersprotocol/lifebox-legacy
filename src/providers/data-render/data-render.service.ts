import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';

import { StepsDataEntity, SleepActivityEntity, IodoorDataEntity } from '../../entities/daily-data.entity';
import { AirQualityReport, IodoorReport, SleepActivityReport, WeatherReport} from '../../types/report.type';

@Injectable()
export class DataRenderService {

  constructor(private dataService: DataService) {

  }

  async getAirQualityReport(date: Date) {
    return new Promise<AirQualityReport>((resolve, reject) => {
      this.dataService.getDailyAirQuality(date).then(ad => {
        let airQualityReport: AirQualityReport = {
          airQualityIndex: ad['aqi'],
          airQualityIndexDiff: ad['aqiDiff'],
          airQualityStatus: ad['status']
        }
        resolve(airQualityReport);
      });
    });
  }

  async getWeatherReport(date: Date) {
    return new Promise<WeatherReport>((resolve, reject) => {
      this.dataService.getDailyWeather(date).then(wd => {
        let weatherReport: WeatherReport = {
          weatherTempCelsius: wd['tempCelsius'],
          weatherTempCelsiusDiff: wd['tempCelsiusDiff'],
          weatherHumidity: wd['humidity'],
          weatherHumidityDiff: wd['humidityDiff']
        }
        resolve(weatherReport);
      });
    });
  }

  async getIodoorReport(date: Date) {
    return new Promise<IodoorReport>((resolve, reject) => {
      this.dataService.getDailyIodoorData(date)
      .then((data: IodoorDataEntity) => {
        if (!data.isValid()) reject();
        let iodoorReport: IodoorReport = {
          indoorPercent: data.indoorPercent.toString(),
          outdoorPercent: data.outdoorPercent.toString()
        }
        resolve(iodoorReport);
      }).catch(e => reject(e));
    });
  }

  async getSleepActivityReport(date: Date) {
    return new Promise<SleepActivityReport>((resolve, reject) => {
      this.dataService.getDailySleepActivity(date)
      .then((data: SleepActivityEntity) => {
        if (!data.isValid()) reject();
        let sleepTime = Math.round(data.sleepDuration * 10) / 10;
        let wokeupDate = new Date(data.wokeupTimestamp);
        let wokeupTime = `${wokeupDate.getHours() <= 12 ? wokeupDate.getHours() : wokeupDate.getHours() - 12}:` +
                  `${wokeupDate.getMinutes() < 10 ? '0' + wokeupDate.getMinutes() : wokeupDate.getMinutes()} ` +
                  `${wokeupDate.getHours() < 12 ? 'AM' : 'PM'}`;
        let sleepActivityReport: SleepActivityReport = {
          sleepTime: sleepTime.toString(),
          wokeupTime: wokeupTime
        }
        resolve(sleepActivityReport);
      }).catch(e => reject(e));
    });
  }

  async getSteps(date: Date) {
    return new Promise<string>((resolve, reject) => {
      this.dataService.getDailyStepsData(date)
      .then((data: StepsDataEntity) => {
        if (data.steps == -1) reject();
        resolve(data.steps.toString());
      }).catch(e => reject(e));
    });
  }

}
