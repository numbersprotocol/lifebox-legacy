import { Injectable } from '@angular/core';

import { DataService } from '../data/data.service';
import { DatetimeService } from '../datetime/datetime.service';
import { EnvService } from '../env/env.service';
import { RepoService } from '../repo/repo.service';

import { AirQualityStatus } from 'src/app/models/env.model';
import { CustomClassEntity } from 'src/app/entities/customClass.entity';
import { DISPLAY, DailyReport, AirQualityReport, WeatherReport, IodoorReport,
  SleepActivityReport, StepsReport, CustomClassReport } from 'src/app/models/daily-report.model';
import { StepsDataEntity, SleepActivityEntity, IodoorDataEntity } from '../../entities/daily-data.entity';

@Injectable({
  providedIn: 'root'
})
export class DataRenderService {

  constructor(
    private datetimeService: DatetimeService,
    private dataService: DataService,
    private envService: EnvService,
    private repoService: RepoService,
   ) { }

  async getAirQualityReportByDate(date: Date) {
    return new Promise<AirQualityReport>((resolve, reject) => {
      const report: AirQualityReport = {
        airQualityIndex: null,
        airQualityStatus: null,
        airQualityIndexDiff: DISPLAY.NOT_AVAILABLE,
      };
      this.dataService.getAverageAqiByDate(date).then(aqi => {
        report.airQualityIndex = aqi.toFixed(2);
        const status = new AirQualityStatus(aqi);
        report.airQualityStatus = status.descriptor;
        resolve(report);
      }).catch(e => reject(e));
    });
  }

  async getAirQualityReportToday() {
    return new Promise<AirQualityReport>((resolve, reject) => {
      const report: AirQualityReport = {
        airQualityIndex: DISPLAY.NO_DATA,
        airQualityStatus: DISPLAY.NO_DATA,
        airQualityIndexDiff: DISPLAY.NOT_AVAILABLE,
      };
      this.dataService.getLatestAirQualityData().then(async data => {
        const status = new AirQualityStatus(data.aqi);
        report.airQualityIndex = data.aqi.toFixed(2);
        report.airQualityStatus = status.descriptor;
        this.envService.getYesterdayAqiLevelDiff(status.level)
        .then(diff => {
          report.airQualityIndexDiff = this.getAirQualityIndexDiffDisplay(diff);
          resolve(report);
        }).catch(e => {
          report.airQualityIndexDiff = DISPLAY.NOT_AVAILABLE;
          resolve(report);
        });
      }).catch(e => reject(e));
    });
  }

  async getCustomClassReportByDate(date: Date) {
    return new Promise<CustomClassReport>((resolve, reject) => {
      const report: CustomClassReport = {
        classes: [],
      };
      this.repoService.getCustomClassWithRecordByDate(date)
        .then((data: CustomClassEntity[]) => {
          if (data.length === 0) {
            reject();
          }
          report.classes = data;
          resolve(report);
        }).catch(e => reject(e));
    });
  }

  async getIodoorReportByDate(date: Date) {
    return new Promise<IodoorReport>((resolve, reject) => {
      const report: IodoorReport = {
        indoorPercent: DISPLAY.NO_DATA,
        outdoorPercent: DISPLAY.NO_DATA,
        indoorPercentDiff: DISPLAY.NOT_AVAILABLE,
        outdoorPercentDiff: DISPLAY.NOT_AVAILABLE,
      };
      this.dataService.getDailyIodoorData(date)
        .then((data: IodoorDataEntity) => {
          if (!data.isValid()) {
            reject();
          }
          report.indoorPercent = data.indoorPercent.toString();
          report.outdoorPercent = data.outdoorPercent.toString();
          this.getYesterdayIodoorDiff(data.indoorPercent, data.outdoorPercent, date)
          .then(diff => {
            report.indoorPercentDiff = diff[0];
            report.outdoorPercentDiff = diff[1];
            resolve(report);
          }).catch(() => resolve(report));
        }).catch(e => reject(e));
    });
  }

  async getSleepActivityReportByDate(date: Date) {
    return new Promise<SleepActivityReport>((resolve, reject) => {
      const report: SleepActivityReport = {
        sleepTime: DISPLAY.NO_DATA,
        wokeupTime: DISPLAY.NO_CLOCK_DATA,
        sleepTimeDiff: DISPLAY.NOT_AVAILABLE,
        wokeupTimeDiff: DISPLAY.NOT_AVAILABLE,
      };
      this.dataService.getDailySleepActivity(date)
        .then((data: SleepActivityEntity) => {
          if (!data.isValid()) {
            reject();
          }
          const sleepTime = Math.round(data.sleepDuration * 10) / 10;
          const wokeupDate = new Date(data.wokeupTimestamp);
          const wokeupTime = `${wokeupDate.getHours() <= 12 ? wokeupDate.getHours() : wokeupDate.getHours() - 12}:` +
            `${wokeupDate.getMinutes() < 10 ? '0' + wokeupDate.getMinutes() : wokeupDate.getMinutes()} ` +
            `${wokeupDate.getHours() < 12 ? 'AM' : 'PM'}`;
          report.sleepTime = sleepTime.toString();
          report.wokeupTime = wokeupTime.toString();
          this.getYesterdaySleepActivityDiff(data.sleepDuration, data.wokeupTimestamp, date)
          .then(diff => {
            report.sleepTimeDiff = this.formatHoursDiff(diff[0]);
            report.wokeupTimeDiff = this.formatTimestampDiff(diff[1]);
            resolve(report);
          }).catch(() => resolve(report));
        }).catch(e => reject(e));
    });
  }

  async getStepsReportByDate(date: Date) {
    return new Promise<StepsReport>((resolve, reject) => {
      const report: StepsReport = {
        steps: null,
        stepsDiff: DISPLAY.NOT_AVAILABLE,
      };
      this.dataService.getDailyStepsData(date)
        .then((data: StepsDataEntity) => {
          if (data.steps === -1) {
            reject();
          }
          report.steps = data.steps.toString();
          this.getYesterdayStepsDiff(data.steps, date)
          .then(diff => {
            report.stepsDiff = diff;
            resolve(report);
          }).catch(() => resolve(report));
        }).catch(e => reject(e));
    });
  }

  async getWeatherReportByDate(date: Date) {
    return new Promise<WeatherReport>((resolve, reject) => {
      const report: WeatherReport = {
        weatherHumidity: DISPLAY.NO_DATA,
        weatherHumidityDiff: DISPLAY.NOT_AVAILABLE,
        weatherTempCelsius: DISPLAY.NO_DATA,
        weatherTempCelsiusDiff: DISPLAY.NOT_AVAILABLE,
      };
      const pHumidity = this.dataService.getAverageHumidityByDate(date).then(humidity => {
        report.weatherHumidity = humidity.toFixed(2);
      });

      const pTempCelsius = this.dataService.getAverageTempCelsiusByDate(date).then(tempCelsius => {
        report.weatherTempCelsius = tempCelsius.toFixed(2);
      });

      Promise.all([pHumidity, pTempCelsius])
      .then(() => resolve(report))
      .catch(() => resolve(report));
    });
  }

  async getWeatherReportToday() {
    return new Promise<WeatherReport>((resolve, reject) => {
      const report: WeatherReport = {
        weatherHumidity: DISPLAY.NO_DATA,
        weatherHumidityDiff: DISPLAY.NOT_AVAILABLE,
        weatherTempCelsius: DISPLAY.NO_DATA,
        weatherTempCelsiusDiff: DISPLAY.NOT_AVAILABLE,
      };
      this.dataService.getLatestWeatherData().then(async data => {
        report.weatherHumidity = data.humidity.toString();
        report.weatherTempCelsius = data.tempCelsius.toString();

        const pHumidityDiff = this.envService.getYesterdayHumidityDiff(data.humidity)
        .then(humidityDiff => {
          if (humidityDiff) {
            report.weatherHumidityDiff = this.getHumidityDiffDisplay(humidityDiff);
          }
        }).catch(() => {
          report.weatherHumidityDiff = DISPLAY.NOT_AVAILABLE;
        });

        const pTempCelsiusDiff = this.envService.getYesterdayTempCelsiusDiff(data.tempCelsius)
        .then(tempCelsiusDiff => {
          if (tempCelsiusDiff) {
            report.weatherTempCelsiusDiff = this.getSignedDiff(tempCelsiusDiff, 2);
          }
        }).catch(() => {
          report.weatherTempCelsiusDiff = DISPLAY.NOT_AVAILABLE;
        });

        Promise.all([pHumidityDiff, pTempCelsiusDiff])
        .then(() => resolve(report))
        .catch(() => resolve(report));
      }).catch(e => reject(e));
    });
  }

  async reloadHomeReport() {
    return new Promise<DailyReport>((resolve, reject) => {
      const today = new Date();
      const report = new DailyReport();

      const pAirQuality = this.getAirQualityReportToday()
      .then(res => {
        report.setAirQuality(res);
      }).catch(e => console.log(e));

      const pCustomClass = this.getCustomClassReportByDate(today)
      .then(res => {
        report.setCustomClass(res);
      }).catch(e => console.log(e));

      const pIodoor = this.getIodoorReportByDate(today)
      .then(res => {
        report.setIodoor(res);
      }).catch(e => console.log(e));

      const pSteps = this.getStepsReportByDate(today)
      .then(res => {
        report.setSteps(res);
      }).catch(e => console.log(e));

      const pSleepActivity = this.getSleepActivityReportByDate(today)
      .then(res => {
        report.setSleepActivity(res);
      }).catch(e => console.log(e));

      const pWeather = this.getWeatherReportToday()
      .then(res => {
        report.setWeather(res);
      }).catch(e => console.log(e));

      Promise.all([
        pAirQuality,
        pCustomClass,
        pIodoor,
        pSteps,
        pSleepActivity,
        pWeather,
      ]).then(() => resolve(report))
      .catch(() => resolve(report));
    });
  }

  async reloadJournalReport(date: Date) {
    return new Promise<DailyReport>((resolve, reject) => {
      const report = new DailyReport();

      const pAirQuality = this.getAirQualityReportByDate(date)
      .then(res => {
        report.setAirQuality(res);
      }).catch(e => console.log(e));

      const pCustomClass = this.getCustomClassReportByDate(date)
      .then(res => {
        report.setCustomClass(res);
      }).catch(e => console.log(e));

      const pIodoor = this.getIodoorReportByDate(date)
      .then(res => {
        report.setIodoor(res);
      }).catch(e => console.log(e));

      const pSteps = this.getStepsReportByDate(date)
      .then(res => {
        report.setSteps(res);
      }).catch(e => console.log(e));

      const pSleepActivity = this.getSleepActivityReportByDate(date)
      .then(res => {
        report.setSleepActivity(res);
      }).catch(e => console.log(e));

      const pWeather = this.getWeatherReportByDate(date)
      .then(res => {
        report.setWeather(res);
      }).catch(e => console.log(e));

      Promise.all([
        pAirQuality,
        pCustomClass,
        pIodoor,
        pSteps,
        pSleepActivity,
        pWeather,
      ]).then(() => resolve(report))
      .catch(() => resolve(report));
    });
  }

  private getAirQualityIndexDiffDisplay(diff: number) {
    if (diff > 0) {
      return `+Lv${diff}`;
    } else if (diff === 0) {
      return `Same`;
    } else {
      return `-Lv${diff * -1}`;
    }
  }

  private getHumidityDiffDisplay(diff: number) {
    return (diff >= 0) ? DISPLAY.HIGHER : DISPLAY.LOWER;
  }

  private getSignedDiff(value: number, digits: number) {
    return (value >= 0) ? `+${value.toFixed(digits)}` : `${value.toFixed(digits)}`;
  }

  private async getYesterdayIodoorDiff(indoorPercent: number, outdoorPercent: number, date: Date) {
    return new Promise<string[]>((resolve, reject) => {
      this.dataService.getDailyIodoorData(this.datetimeService.getYesterday(date))
        .then(data => {
          if (!data.isValid()) {
            reject();
          }
          const indoorDiff = this.getSignedDiff(indoorPercent - data.indoorPercent, 2);
          const outdoorDiff = this.getSignedDiff(outdoorPercent - data.outdoorPercent, 2);
          resolve([indoorDiff, outdoorDiff]);
        }).catch(e => reject(e));
    });
  }

  private async getYesterdaySleepActivityDiff(sleepTime: number, wokeupTime: number, date: Date) {
    return new Promise<number[]>((resolve, reject) => {
      const yesterday = this.datetimeService.getYesterday(date);
      this.dataService.getDailySleepActivity(yesterday)
        .then(data => {
          if (!data.isValid()) {
            reject();
          }
          const todayStart = new Date(date).setHours(0, 0, 0, 0);
          const yesterdayStart = new Date(yesterday).setHours(0, 0, 0, 0);
          const sleepTimeDiff = sleepTime - data.sleepDuration;
          const wokeupTimeDiff = (wokeupTime - todayStart) - (data.wokeupTimestamp - yesterdayStart);
          resolve([sleepTimeDiff, wokeupTimeDiff]);
        }).catch(e => reject(e));
    });
  }

  private async getYesterdayStepsDiff(steps: number, date: Date) {
    return new Promise<string>((resolve, reject) => {
      this.dataService.getDailyStepsData(this.datetimeService.getYesterday(date))
        .then(data => {
          if (data.steps === -1) {
            reject();
          }
          resolve(this.getSignedDiff(steps - data.steps, 0));
        }).catch(e => reject(e));
    });
  }

  private formatHoursDiff(diff: number) {
    let sign = '+';
    if (diff < 0) {
      diff = -diff;
      sign = '-';
    }
    const hrs = Math.round(diff);
    const min = Math.round(60 * (diff % 1));
    return `${sign}${hrs}h${min}m`;
  }

  private formatTimestampDiff(diff: number) {
    let sign = '+';
    if (diff < 0) {
      diff = -diff;
      sign = '-';
    }
    const hrs = Math.round( diff / 3600000 );
    const min = Math.round(( diff / 60000 ) % 60);
    return `${sign}${hrs}h${min}m`;
  }

}
