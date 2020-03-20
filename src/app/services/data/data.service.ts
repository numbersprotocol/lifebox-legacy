import { Injectable } from '@angular/core';

import { Between, LessThan } from 'typeorm';

import { DatetimeService } from '../datetime/datetime.service';
import { DataProcessService } from '../data-process/data-process.service';
import { RepoService } from '../repo/repo.service';

import { AirQualityEntity } from '../../entities/airquality.entity';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { CustomClassRecordEntity } from '../../entities/customClassRecord.entity';
import { EnvMetaEntity, IodoorMetaEntity, StepsMetaEntity } from '../../entities/metadata.entity';
import { LocationStatusEntity, PedometerStatusEntity } from '../../entities/sensor-status.entity';
import { FindOption } from 'src/app/models/find-option.model';
import { IodoorDataEntity, SleepActivityEntity, StepsDataEntity } from '../../entities/daily-data.entity';
import { LocationEntity } from '../../entities/location.entity';
import { PedometerEntity } from '../../entities/pedometer.entity';
import { GyroscopeEntity } from '../../entities/gyroscope.entity';
import { WeatherEntity } from '../../entities/weather.entity';

import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private datetimeService: DatetimeService,
    private dataProcessService: DataProcessService,
    private repoService: RepoService
  ) {
  }
 


  async addCustomizeClassData() {
    const today = new Date().setHours(0, 0, 0, 0);
    const customClasses = await this.repoService.getCustomClassWithRecordOrderByIdDesc();
    for (const customClass of customClasses) {
      if (customClass.records[0].dataTimestamp < today) {
        const newRecord = new CustomClassRecordEntity();
        newRecord.class = customClass;
        newRecord.value = null;
        newRecord.dataTimestamp = new Date().getTime();
        await this.repoService.saveCustomClassRecord(newRecord);
      }
    }
    return Promise.resolve();
  }

  async addEnvMeta(date: Date) {
    return new Promise((resolve, reject) => {
      const meta = new EnvMetaEntity();
      meta.dateString = this.datetimeService.timeToDateString(date);
      this.repoService.findEnvMeta(FindOption.DailyDataByDate(date))
        .then((data: Array<EnvMetaEntity>) => {
          if (data.length > 0) { reject('EnvMeta found'); }
          this.repoService.saveEnvMeta(meta)
            .then(res => resolve(res))
            .catch(e => reject(e));
        });
    });
  }

  async addIodoorMeta(date: Date) {
    return new Promise((resolve, reject) => {
      const meta = new IodoorMetaEntity();
      meta.dateString = this.datetimeService.timeToDateString(date);
      this.repoService.findIodoorMeta(FindOption.DailyDataByDate(date))
        .then((data: Array<IodoorMetaEntity>) => {
          if (data.length > 0) { reject('IodoorMeta found'); }
          this.repoService.saveIodoorMeta(meta)
            .then(res => resolve(res))
            .catch(e => reject(e));
        });
    });
  }

  async addStepsMeta(date: Date) {
    return new Promise((resolve, reject) => {
      const meta = new StepsMetaEntity();
      meta.dateString = this.datetimeService.timeToDateString(date);
      this.repoService.findStepsMeta(FindOption.DailyDataByDate(date))
        .then((data: Array<StepsMetaEntity>) => {
          if (data.length > 0) { reject('StepsMeta found'); }
          this.repoService.saveStepsMeta(meta)
            .then(res => resolve(res))
            .catch(e => reject(e));
        });
    });
  }

  async addLocationStatus(status: boolean) {
    return new Promise((resolve, reject) => {
      const locationStatus = new LocationStatusEntity();
      locationStatus.dataTimestamp = this.datetimeService.timeToTimestamp(new Date());
      locationStatus.isAvailable = status;
      this.repoService.saveLocationStatus(locationStatus)
        .then(res => resolve(res))
        .catch(e => reject(e));
    });
  }

  async addNewCustomClass(customClass: CustomClassEntity) {
    return new Promise((resolve, reject) => {
      this.repoService.saveCustomClass(customClass).then(res => {
        this.initCustomClassRecord(res).then(() => {
          resolve();
        }).catch(e => reject(e));
      }).catch(e => reject(e));
    });
  }

  async initCustomClassRecord(customClass: CustomClassEntity) {
    return new Promise((resolve, reject) => {
      const customClassRecord = new CustomClassRecordEntity();
      customClassRecord.class = customClass;
      customClassRecord.value = 0;
      customClassRecord.dataTimestamp = new Date().getTime();
      this.repoService.saveCustomClassRecord(customClassRecord).then(() => {
        resolve();
      }).catch(e => reject(e));
    });
  }

  async addPedometerStatus(status: boolean) {
    return new Promise((resolve, reject) => {
      const pedometerStatus = new PedometerStatusEntity();
      pedometerStatus.dataTimestamp = this.datetimeService.timeToTimestamp(new Date());
      pedometerStatus.isAvailable = status;
      this.repoService.savePedometerStatus(pedometerStatus)
        .then(res => resolve(res))
        .catch(e => reject(e));
    });
  }

  async getAverageAqiByDate(date: Date) {
    return new Promise<number>((resolve, reject) => {
      this.repoService.findAirQuality(FindOption.TimestampDataByDate(date))
      .then((data: Array<AirQualityEntity>) => {
        if (data.length === 0) {
          reject('No valid aqi data');
        }
        resolve(data.reduce((accu, curr) => accu + curr.aqi, 0) / data.length);
      }).catch(e => reject(e));
    });
  }

  async getAverageHumidityByDate(date: Date) {
    return new Promise<number>((resolve, reject) => {
      this.repoService.findWeather(FindOption.TimestampDataByDate(date))
      .then((data: Array<WeatherEntity>) => {
        if (data.length === 0) {
          reject('No valid humidity data');
        }
        resolve(data.reduce((accu, curr) => accu + curr.humidity, 0) / data.length);
      }).catch(e => reject(e));
    });
  }

  async getAverageTempCelsiusByDate(date: Date) {
    return new Promise<number>((resolve, reject) => {
      this.repoService.findWeather(FindOption.TimestampDataByDate(date))
      .then((data: Array<WeatherEntity>) => {
        if (data.length === 0) {
          reject('No valid temperature data');
        }
        resolve(data.reduce((accu, curr) => accu + curr.tempCelsius, 0) / data.length);
      }).catch(e => reject(e));
    });
  }

  async getDailyStepsData(date: Date): Promise<StepsDataEntity> {
    return new Promise<StepsDataEntity>((resolve, reject) => {
      this.repoService.findPedometer(FindOption.TimestampDataByDate(date))
        .then((data: Array<PedometerEntity>) => {
          if (data.length > 0) {
            const stepsData = this.dataProcessService.computeSteps(data, date);
            resolve(stepsData);
          } else {
            const stepsData = new StepsDataEntity();
            stepsData.steps = -1;
            stepsData.dateString = this.datetimeService.timeToDateString(date);
            resolve(stepsData);
          }
        }).catch(e => reject(e));
    });
  }

  async getDailyStepsDataStepsOnly(date: Date): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.repoService.findPedometer(FindOption.TimestampDataByDate(date))
        .then((data: Array<PedometerEntity>) => {
          if (data.length > 0) {
            const stepsData = this.dataProcessService.computeSteps(data, date);
            resolve(stepsData.steps);
          } else {
            resolve(-1);
          }
        }).catch(e => reject(e));
    });
  }

  async getDailySleepActivity(date: Date): Promise<SleepActivityEntity> {
    return new Promise<SleepActivityEntity>((resolve, reject) => {
      this.repoService.findSleepActivity(FindOption.DailyDataByDate(date))
        .then((data: Array<SleepActivityEntity>) => {
          (data.length === 1) ? resolve(data[0]) : resolve(new SleepActivityEntity());
        })
        .catch(e => reject(e));
    });
  }

  async getDailyIodoorData(date: Date): Promise<IodoorDataEntity> {
    const dateStart = new Date(date).setHours(0, 0, 0, 0);

    if (dateStart > new Date().getTime()) {
      return new IodoorDataEntity();
    }

    const preSensorStatus = await Promise.all<Array<LocationStatusEntity>>(
      [this.repoService.findLocationStatus(
        {
          where: { dataTimestamp: LessThan(dateStart) },
          order: { dataTimestamp: 'DESC' },
          take: 1
        }),
      this.repoService.findLocationStatus(FindOption.TimestampDataByDate(date))]);
    const sensorStatus = preSensorStatus.reduce((acc, val) => acc.concat(val), []);
    const statusTimestampPairArray = new Array();
    for (let i = 1; i < sensorStatus.length; i++) {
      if ((sensorStatus[i - 1].isAvailable === true) && (sensorStatus[i].isAvailable === false)) {
        statusTimestampPairArray.push([sensorStatus[i - 1].dataTimestamp >= dateStart ? sensorStatus[i - 1].dataTimestamp : dateStart,
        sensorStatus[i].dataTimestamp, 0]);
      } else if ((sensorStatus[i - 1].isAvailable === true) && (sensorStatus[i].isAvailable === true)) {
        statusTimestampPairArray.push([sensorStatus[i - 1].dataTimestamp >= dateStart ? sensorStatus[i - 1].dataTimestamp : dateStart,
        sensorStatus[i].dataTimestamp, 1]);
      }
    }

    if (sensorStatus.length > 0) {
      statusTimestampPairArray.push(
        [sensorStatus[sensorStatus.length - 1].dataTimestamp >= dateStart ? sensorStatus[sensorStatus.length - 1].dataTimestamp : dateStart,
        dateStart === new Date().setHours(0, 0, 0, 0) ? new Date().getTime() : new Date(date).setHours(23, 59, 59, 999), 0]);
    }

    const locationSets = await Promise.all(statusTimestampPairArray.map((d) =>
      this.repoService.findLocation({
        where: { dataTimestamp: Between(d[0], d[1]) }
      })
    ));

    const iodoorDatas = locationSets.map((d: Array<LocationEntity>, i) => {
      // create mock LocationEntity when location sensor on or off, and let it indoor score
      // equal to 0
      const mockLocationEntityStart = new LocationEntity();
      mockLocationEntityStart.dataTimestamp = statusTimestampPairArray[i][0];
      mockLocationEntityStart.accuracy = 10;
      mockLocationEntityStart.provider = 'network';
      d.unshift(mockLocationEntityStart);

      if (statusTimestampPairArray[i][2] === 0) {
        const mockLocationEntityEnd = new LocationEntity();
        mockLocationEntityEnd.dataTimestamp = statusTimestampPairArray[i][1];
        mockLocationEntityEnd.accuracy = 10;
        mockLocationEntityEnd.provider = 'network';
        d.push(mockLocationEntityEnd);
      }

      return this.dataProcessService.computeIodoor(d, date);
    });

    const iodoorData = new IodoorDataEntity();
    iodoorData.dateString = this.datetimeService.timeToDateString(date);
    iodoorDatas.forEach((d) => {
      iodoorData.addIndoorTime(d.indoorTime);
      iodoorData.addOutdoorTime(d.outdoorTime);
    });

    return iodoorData;
  }

  async getDailyAirQuality(date: Date) {
    return new Promise<AirQualityEntity[]>((resolve, reject) => {
      this.repoService.findAirQuality(FindOption.TimestampDataByDate(date))
        .then(res => resolve(res))
        .catch(e => reject(e));
    });
  }

  async getDailyWeather(date: Date) {
    return new Promise<WeatherEntity[]>((resolve, reject) => {
      this.repoService.findWeather(FindOption.TimestampDataByDate(date))
        .then(res => resolve(res))
        .catch(e => reject(e));
    });
  }

  async getDateWithAvailableData(): Promise<Array<string>> {
    return new Promise<Array<string>>(resolve => {
      const findEnv = new Promise((innerResolve, reject) => {
        const arr = [];
        this.repoService.findEnvMeta().then((res: Array<EnvMetaEntity>) => {
          res.forEach(entity => arr.push(entity.dateString));
          innerResolve(arr);
        });
      });
      const findIodoor = new Promise(innerResolve => {
        const arr = [];
        this.repoService.findIodoorMeta().then((res: Array<IodoorMetaEntity>) => {
          res.forEach(entity => arr.push(entity.dateString));
          innerResolve(arr);
        });
      });
      const findSteps = new Promise(innerResolve => {
        const arr = [];
        this.repoService.findStepsMeta().then((res: Array<StepsMetaEntity>) => {
          res.forEach(entity => arr.push(entity.dateString));
          innerResolve(arr);
        });
      });
      Promise.all([findEnv, findIodoor, findSteps]).then(([env, iodoor, steps]: any) => {
        let ret = env.concat(iodoor, steps);
        const uniqueFilter = (arr) => arr.filter((v, i) => arr.indexOf(v) === i);
        ret = uniqueFilter(ret.sort().reverse());
        resolve(ret);
      });
    });
  }

  async generateSleepActivityData(date: Date) {
    return new Promise((resolve, reject) => {
      this.repoService.findPedometer(FindOption.SleepActivity(date))
        .then((data: Array<PedometerEntity>) => {
          const sleepActivity = this.dataProcessService.computeSleepActivity(data, date);
          this.repoService.saveSleepActivity(sleepActivity).then(res => resolve(res)).catch(e => reject(e));
        }).catch(e => reject(e));
    });
  }

  async getLatestAirQualityData() {
    return new Promise<AirQualityEntity>((resolve, reject) => {
      this.repoService.findAirQuality(FindOption.LatestOne()).then((res) => {
        if (res.length === 0) {
          reject('No valid data');
        }
        resolve(res[0]);
      }).catch(e => reject(e));
    });
  }

  async getLatestLocationData() {
    return new Promise<LocationEntity>((resolve, reject) => {
      this.repoService.findLocation(FindOption.LatestOne()).then((res) => {
        if (res.length === 0) {
          reject('No valid data');
        }
        resolve(res[0]);
      }).catch(e => reject(e));
    });
  }

  async getLatestWeatherData() {
    return new Promise<WeatherEntity>((resolve, reject) => {
      this.repoService.findWeather(FindOption.LatestOne()).then((res) => {
        if (res.length === 0) {
          reject('No valid data');
        }
        resolve(res[0]);
      }).catch(e => reject(e));
    });
  }

  async getUnsentEnvMeta() {
    return new Promise<EnvMetaEntity[]>((resolve, reject) => {
      this.repoService.findEnvMeta(FindOption.UnsentMeta()).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

  async getUnsentIodoorMeta() {
    return new Promise<IodoorMetaEntity[]>((resolve, reject) => {
      this.repoService.findIodoorMeta(FindOption.UnsentMeta()).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

  async getUnsentStepsMeta() {
    return new Promise<StepsMetaEntity[]>((resolve, reject) => {
      this.repoService.findStepsMeta(FindOption.UnsentMeta()).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

  async getSingleCustomClassData(date: Date = null, classID: number = null) {
    // this function is for getting several days custom class data,
    // and the array records days with no data
    if (!date) date = new Date();
    return new Promise<CustomClassEntity>((resolve, reject) => {
       this.repoService.repo.customClass
      .createQueryBuilder('customClass')
      .leftJoinAndSelect(
        'customClass.records',
        'custom_class_record_entity'
      )
      .where('customClass.id = :id', {id: classID})
      .getMany()
      .then(singleClass => {
        console.log('singleClass!', singleClass);
        singleClass[0].records = singleClass[0].records.filter(d =>
          d.dataTimestamp >= new Date(date).setHours(0, 0, 0, 0) &&
          d.dataTimestamp <= new Date(date).setHours(23, 59, 59, 999)
        )
        console.debug('dataService.getSingleCustomClassData: ', singleClass);
        resolve(singleClass[0]);
      })
      .catch(err => reject(err));
    })

}

  async getSingleCustomClassDataByDate(endDate: Date = null, howManyDays: number = 0,
                                       classID: number = null){
    // this function is for getting several days value of custom class data,
    // and the array records days with no data, and return several days
    // custom class data entity

    let days = d3.range(howManyDays - 1, -1, -1)
    .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    let preDaysSingleCustomClassData = await Promise.all<CustomClassEntity>(days.map((d) =>
      this.getSingleCustomClassData(d, classID)
    ));

    let daysSingleCustomClassData = new Array(preDaysSingleCustomClassData.length);
    let singleCustomClassDataHollow = new Array(preDaysSingleCustomClassData.length);

    preDaysSingleCustomClassData.forEach((d, i) => {
      if (d.records.length > 0 && d.records[0].value != null) {
        daysSingleCustomClassData[i] = d.records[0].value
        singleCustomClassDataHollow[i] = 0
      }
      else {
        daysSingleCustomClassData[i] = 0
        singleCustomClassDataHollow[i] = 1
      }
    })

    return [daysSingleCustomClassData, singleCustomClassDataHollow, preDaysSingleCustomClassData]
  }


  async getStepsByDate(endDate: Date, howManyDays: number = 0) {
    // this function is for getting several days steps data,
    // and the array records days with no data
    const days = d3.range(howManyDays - 1, -1, -1)
      .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    const preDaysSteps = await Promise.all(days.map((d) => this.getDailyStepsDataStepsOnly(d)));

    const stepsHollow = new Array<number>(preDaysSteps.length);
    const daysSteps = new Array<number>(preDaysSteps.length);
    preDaysSteps.forEach((d, i) => {
      if (d === -1) {
        stepsHollow[i] = 1;
        daysSteps[i] = 0;
      } else {
        stepsHollow[i] = 0;
        daysSteps[i] = d;
      }
    });

    return [daysSteps, stepsHollow];
  }

  async getIodoorByDate(endDate: Date, howManyDays: number = 0) {
    // this function is for getting several days iodoor data,
    // and the array records days with no data
    const days = d3.range(howManyDays - 1, -1, -1)
      .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    const sevenDaysIodoor = await Promise.all<IodoorDataEntity>(days.map((d) => this.getDailyIodoorData(d)));

    const sevenDaysIndoor = sevenDaysIodoor.map(d => d.indoorPercent);
    const sevenDaysOutdoor = sevenDaysIodoor.map(d => d.outdoorPercent);
    const iodoorHollow = sevenDaysIodoor.map(d => {
      if (d.outdoorPercent === 0 && d.indoorPercent === 0) {
        console.log('no in/outdoor data');
        return 1;
      } else {
        return 0;
      }
    });

    return [sevenDaysIndoor, sevenDaysOutdoor, iodoorHollow];
  }

  async getBloodByDate() {

    return [0, 11,22, 33,44,55,66,77];
  }

  async getSleepByDate(endDate: Date, howManyDays: number = 0) {
    // this function is for getting several days sleep data,
    // and the array records days with no data

    const days = d3.range(howManyDays - 1, -1, -1)
      .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    const preDaysSleep = await Promise.all<SleepActivityEntity>(days.map((d) => this.getDailySleepActivity(d)));

    const daysSleep = new Array(preDaysSleep.length);
    const sleepHollow = new Array(preDaysSleep.length);

    preDaysSleep.forEach((d, i) => {
      if (d.isValid()) {
        daysSleep[i] = d;
        sleepHollow[i] = 0;
      } else {
        console.log('no sleep data');
        const mockSleepActivity = new SleepActivityEntity();
        daysSleep[i] = mockSleepActivity;
        sleepHollow[i] = 1;
      }
    });

    // why subtract with 4:00 is that the method we calculate wokeup time,
    // we take the first steps event time after 4:00 as the time one woke-up
    const daysWokeupTimeDiff = daysSleep.map((d, i) => {
      if (d.wokeupTimestamp !== 0) {
        return d.wokeupTimestamp - new Date(days[i]).setHours(4, 0, 0, 0);
      } else {
        return 0;
      }
    });

    const daysSleepingTime = daysSleep.map(d => d.sleepDuration);

    return [daysWokeupTimeDiff, daysSleepingTime, sleepHollow];
  }

  async getWeatherByDate(endDate: Date, howManyDays: number = 0) {
    // this function is for getting several days weather data,
    // and the array records days with no data

    const days = d3.range(howManyDays - 1, -1, -1)
      .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    const preDaysWeather = await Promise.all(days.map((d) => this.getDailyWeather(d)));

    const daysWeather = new Array(preDaysWeather.length);
    const weatherHollow = new Array(preDaysWeather.length);

    preDaysWeather.forEach((d: any, i) => {
      if (d.length === 0) {
        console.log('no weather data');
        daysWeather[i] = [0, 0];
        weatherHollow[i] = 1;
      } else {
        daysWeather[i] = [
          d.reduce((accu, curr) => accu + curr.tempCelsius, 0) / d.length,
          d.reduce((accu, curr) => accu + curr.humidity, 0) / d.length
        ];
        weatherHollow[i] = 0;
      }
    });

    const daysTempCelsius = daysWeather.map(d => d[0]);
    const daysHumidity = daysWeather.map(d => d[1]);

    return [daysTempCelsius, daysHumidity, weatherHollow];
  }

  async getAQIByDate(endDate: Date, howManyDays: number = 0) {
    // this function is for getting several days AQI data,
    // and the array records days with no data

    const days = d3.range(howManyDays - 1, -1, -1)
      .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    const preDaysAQI = await Promise.all(days.map((d) => this.getDailyAirQuality(d)));

    const daysAQI = new Array(preDaysAQI.length);
    const aqiHollow = new Array(preDaysAQI.length);

    preDaysAQI.forEach((d: any, i) => {
      if (d.length === 0) {
        console.log('no AQI data');
        daysAQI[i] = 0;
        aqiHollow[i] = 1;
      } else {
        daysAQI[i] = d.reduce((accu, curr) => accu + curr.aqi, 0) / d.length;
        aqiHollow[i] = 0;
      }
    });

    return [daysAQI, aqiHollow];
  }

  async getJournalDataByDate(endDate: Date, howManyDays: number = 0) {
    // this function is for getting several days data set for journal chart,
    // and the arrays records days with no data

    let steps, iodoors, sleeps, weathers, aqiArray;
    [steps, iodoors, sleeps, weathers, aqiArray] = await Promise.all(
      [this.getStepsByDate(endDate, howManyDays),
      this.getIodoorByDate(endDate, howManyDays),
      this.getSleepByDate(endDate, howManyDays),
      this.getWeatherByDate(endDate, howManyDays),
      this.getAQIByDate(endDate, howManyDays)]
    );

    const dataArray = [steps[0], iodoors[1],
    sleeps[1], sleeps[0],
    weathers[0], weathers[1],
    aqiArray[0]];

    const hollowArray = [steps[1], iodoors[2],
    sleeps[2], sleeps[2],
    weathers[2], weathers[2],
    aqiArray[1]];

    return [dataArray, hollowArray];
  }

  async isCustomClassReachMax(max: number) {
    return new Promise<boolean> ((resolve, reject) => {
      this.repoService.countCustomClass().then(res => {
        (res >= max) ? resolve(true) : resolve(false);
      }).catch(e => reject(e));
    });
  }

  async hasCustomClassRecordToday() {
    return new Promise<boolean> ((resolve, reject) => {
      const today = new Date().setHours(0, 0, 0, 0);
      this.repoService.getCustomClassWithRecordOrderByIdDesc().then(res => {
        for (const customClass of res) {
          (customClass.records[0].dataTimestamp < today) ? resolve(true) : resolve(false);
        }
      }).catch(e => reject(e));
    });
  }

  async modifyLatestCustomClassRecord(customClass: CustomClassEntity, value: number) {
    return new Promise((resolve, reject) => {
      customClass.records[0].value += value;
      customClass.records[0].dataTimestamp = new Date().getTime();
      this.repoService.saveCustomClassRecord(customClass.records[0]).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

}
