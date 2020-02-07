import { Injectable } from '@angular/core';
import { Between, createConnection, getRepository, Repository, FindOneOptions, FindManyOptions, LessThan } from 'typeorm';
import { CordovaConnectionOptions } from 'typeorm/driver/cordova/CordovaConnectionOptions';

import { DataProcessService } from '../data-process/data-process.service';
import { DatetimeService } from '../datetime/datetime.service';

import { ConfigEntity } from '../../entities/config.entity';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { CustomClassRecordEntity } from '../../entities/customClassRecord.entity';
import { EnvMetaEntity, IodoorMetaEntity, StepsMetaEntity } from '../../entities/metadata.entity';
import { IodoorDataEntity, SleepActivityEntity, StepsDataEntity } from '../../entities/daily-data.entity';
import { LocationEntity } from '../../entities/location.entity';
import { PedometerEntity } from '../../entities/pedometer.entity';
import { GyroscopeEntity } from '../../entities/gyroscope.entity';
import { WeatherEntity } from '../../entities/weather.entity';
import { AirQualityEntity } from '../../entities/airquality.entity';
import { LocationStatusEntity, PedometerStatusEntity } from '../../entities/sensor-status.entity';

const connectionOptions: CordovaConnectionOptions = {
    type: 'cordova',
    database: 'numbers.db',
    location: 'default',
    logging: ['error', 'schema'],
    synchronize: true,
    entities: [
      ConfigEntity, CustomClassEntity, CustomClassRecordEntity, LocationEntity, PedometerEntity, GyroscopeEntity,
      EnvMetaEntity, IodoorDataEntity, IodoorMetaEntity, StepsDataEntity, StepsMetaEntity,
      SleepActivityEntity, WeatherEntity, AirQualityEntity, LocationStatusEntity, PedometerStatusEntity
    ]
}

import * as d3 from 'd3'
import { stat } from 'fs';

@Injectable()
export class DataService {
  configRepository: Repository<ConfigEntity>;
  locationRepository: Repository<LocationEntity>;
  pedometerRepository: Repository<PedometerEntity>;
  gyroscopeRepository: Repository<GyroscopeEntity>;
  envMetaRepository: Repository<EnvMetaEntity>;
  iodoorDataRepository: Repository<IodoorDataEntity>;
  iodoorMetaRepository: Repository<IodoorMetaEntity>;
  stepsDataReposiotry: Repository<StepsDataEntity>;
  stepsMetaReposiotry: Repository<StepsMetaEntity>;
  sleepActivityRepository: Repository<SleepActivityEntity>;
  weatherRepository: Repository<WeatherEntity>;
  airQualityRepository: Repository<AirQualityEntity>;
  customClassRepository: Repository<CustomClassEntity>;
  customClassRecordRepository: Repository<CustomClassRecordEntity>;
  locationStatusRepository: Repository<LocationStatusEntity>;
  pedometerStatusRepository: Repository<PedometerStatusEntity>;
  constructor(private dataProcessService: DataProcessService,
              private datetimeService: DatetimeService) {

  }

  async init(){
    return new Promise((resolve, reject) => {
      createConnection(connectionOptions).then(res => {
        this.configRepository = getRepository('config') as Repository<ConfigEntity>;
        this.locationRepository = getRepository('location') as Repository<LocationEntity>;
        this.pedometerRepository = getRepository('pedometer') as Repository<PedometerEntity>;
        this.gyroscopeRepository = getRepository('gyroscope') as Repository<GyroscopeEntity>;
        this.envMetaRepository = getRepository('envMeta') as Repository<EnvMetaEntity>;
        this.iodoorDataRepository = getRepository('iodoorData') as Repository<IodoorDataEntity>;
        this.iodoorMetaRepository = getRepository('iodoorMeta') as Repository<IodoorMetaEntity>;
        this.stepsDataReposiotry = getRepository('stepsData') as Repository<StepsDataEntity>;
        this.stepsMetaReposiotry = getRepository('stepsMeta') as Repository<StepsMetaEntity>;
        this.sleepActivityRepository = getRepository('sleepActivity') as Repository<SleepActivityEntity>;
        this.weatherRepository = getRepository('weather') as Repository<WeatherEntity>;
        this.airQualityRepository = getRepository('airquality') as Repository<AirQualityEntity>;
        this.customClassRepository = getRepository('customClass') as Repository<CustomClassEntity>;
        this.customClassRecordRepository = getRepository('customClassRecord') as Repository<CustomClassRecordEntity>;
        this.locationStatusRepository = getRepository('locationStatus') as Repository<LocationStatusEntity>;
        this.pedometerStatusRepository = getRepository('pedometerStatus') as Repository<PedometerStatusEntity>;
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async addCUstomizeClassData(date: Date = null): Promise<CustomClassEntity[]> {
    return new Promise(async(resolve, reject) => {
      let _customClasses = await this.getCustomClassData();
      console.log('custom classes: ', _customClasses);
      let today = new Date().setHours(0, 0, 0, 0);
      console.log('today: ', today);

      for (var i = 0; i < _customClasses.length; i++) {
        if (_customClasses[i].records[0].dateTimeStamp < today) {
          let newRecord = new CustomClassRecordEntity();
          newRecord.class = _customClasses[i];
          newRecord.value = null;
          newRecord.dateTimeStamp = new Date().getTime();
          await this.customClassRecordRepository.save(newRecord);
        }
      }
      this.getCustomClassData()
      .then(classes => resolve(classes))
      .catch(err => reject(err));
    })
  }

  async addEnvMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      let meta = new EnvMetaEntity();
      meta.dateString = this.datetimeService.timeToDateString(date);
      this.findEnvMeta(this.DailyRangeOptions(date))
      .then((data: Array<EnvMetaEntity>) => {
        if (data.length > 0) reject('EnvMeta found');
        this.saveEnvMeta(meta)
        .then(res => resolve(res))
        .catch(e => reject(e));
      });
    })
  }

  async addIodoorMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      let meta = new IodoorMetaEntity();
      meta.dateString = this.datetimeService.timeToDateString(date);
      this.findIodoorMeta(this.DailyRangeOptions(date))
      .then((data: Array<IodoorMetaEntity>) => {
        if (data.length > 0) reject('IodoorMeta found');
        this.saveIodoorMeta(meta)
        .then(res => resolve(res))
        .catch(e => reject(e));
      });
    })
  }

  async addStepsMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      let meta = new StepsMetaEntity();
      meta.dateString = this.datetimeService.timeToDateString(date);
      this.findStepsMeta(this.DailyRangeOptions(date))
      .then((data: Array<StepsMetaEntity>) => {
        if (data.length > 0) reject('StepsMeta found');
        this.saveStepsMeta(meta)
        .then(res => resolve(res))
        .catch(e => reject(e));
      });
    })
  }

  async addLocationStatus(status: boolean) {
    return new Promise((resolve, reject) => {
      let locationStatus = new LocationStatusEntity();
      locationStatus.dataTimestamp = this.datetimeService.timeToTimestamp(new Date());
      locationStatus.isAvailable = status;
      this.saveLocationStatus(locationStatus)
      .then(res => resolve(res))
      .catch(e => reject(e))
    });
  }

  async addPedometerStatus(status: boolean) {
    return new Promise((resolve, reject) => {
      let pedometerStatus = new PedometerStatusEntity();
      pedometerStatus.dataTimestamp = this.datetimeService.timeToTimestamp(new Date());
      pedometerStatus.isAvailable = status;
      this.savePedometerStatus(pedometerStatus)
      .then(res => resolve(res))
      .catch(e => reject(e))
    });
  }

  async findConfig(findOptions: FindOneOptions = null) {
    return new Promise ((resolve, reject) => {
      this.configRepository.findOne(findOptions).then((res) => {
        resolve(res);
        console.debug('findConfig result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findLocation(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.locationRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findLocation result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findLocationStatus(findOptions: FindManyOptions = null) {
    return new Promise <Array<LocationStatusEntity>>((resolve, reject) => {
      this.locationStatusRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findLocationStatus result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findPedometer(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.pedometerRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findPedometer result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findPedometerStatus(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.pedometerStatusRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findPedometerStatus result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findGyroscope(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.gyroscopeRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findGyroscope result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findEnvMeta(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.envMetaRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findenvMeta result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findIodoorData(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.iodoorDataRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findIodoorData result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findIodoorMeta(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.iodoorMetaRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findIodoorMeta result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findSleepActivity(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.sleepActivityRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findSleepActivity result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findStepsData(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.stepsDataReposiotry.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findstepsData result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findStepsMeta(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.stepsMetaReposiotry.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findstepsMeta result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findWeather(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.weatherRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findWeather result: ', res);
      }).catch(e => reject(e));
    })
  }

  async findAirQuality(findOptions: FindManyOptions = null) {
    return new Promise ((resolve, reject) => {
      this.airQualityRepository.find(findOptions).then((res) => {
        resolve(res);
        console.debug('findAirQuality result: ', res);
      }).catch(e => reject(e));
    })
  }

  async getCustomClassData(date: Date = null): Promise<CustomClassEntity[]> {
    return new Promise<CustomClassEntity[]>((resolve, reject) => {
      if (!date) date = new Date();
       this.customClassRepository
      .createQueryBuilder('customClass')
      .leftJoinAndSelect(
        'customClass.records',
        'custom_class_record_entity'
      )
      .orderBy('custom_class_record_entity_id', 'DESC')
      .getMany()
      .then(classes => {
        console.log('dataService.getCustomClassData: ', classes);
        resolve(classes);
      })
      .catch(err => reject(err));
    })
  }

  async getDailyStepsData(date: Date = null): Promise<StepsDataEntity>{
    return new Promise<StepsDataEntity>((resolve, reject) => {
      if (!date) date = new Date();
      this.findPedometer(this.DailyTimestampRangeOptions(date))
      .then((data: Array<PedometerEntity>) => {
        if (data.length > 0) {
          let stepsData = this.dataProcessService.computeSteps(data, date);
          resolve(stepsData)
        }
        else {
          let stepsData = new StepsDataEntity();
          stepsData.steps = -1;
          stepsData.dateString = this.datetimeService.timeToDateString(date);
          resolve(stepsData)
        }
      }).catch(e => reject(e));
    })
  }

  async getDailyStepsDataStepsOnly(date: Date = null): Promise<number>{
    return new Promise<number>((resolve, reject) => {
      if (!date) date = new Date();
      this.findPedometer(this.DailyTimestampRangeOptions(date))
      .then((data: Array<PedometerEntity>) => {
        if (data.length > 0) {
          let stepsData = this.dataProcessService.computeSteps(data, date);
          resolve(stepsData.steps);
        }
        else {
          resolve(-1)
        }
      }).catch(e => reject(e));
    })
  }

  async getDailySleepActivity(date: Date = null): Promise<SleepActivityEntity>{
    return new Promise<SleepActivityEntity>((resolve, reject) => {
      if (!date) date = new Date();
      this.findSleepActivity(this.DailyRangeOptions(date))
      .then((data: Array<SleepActivityEntity>) => {
        (data.length == 1) ? resolve(data[0]) : resolve(new SleepActivityEntity());
      })
      .catch(e => reject(e));
    })
  }

  async getDailyIodoorData(date: Date = null): Promise<IodoorDataEntity>{
    if (!date) date = new Date();
    let dateStart = new Date(date).setHours(0, 0, 0, 0)

    if (dateStart > new Date().getTime()){
      return new IodoorDataEntity
    }

    let preSensorStatus = await Promise.all <Array<LocationStatusEntity>>(
      [this.findLocationStatus(
      {where: {dataTimestamp: LessThan(dateStart)},
       order: {dataTimestamp: 'DESC'},
       take: 1}),
       this.findLocationStatus(this.DailyTimestampRangeOptions(date))]);
    let sensorStatus = preSensorStatus.reduce((acc, val) => acc.concat(val), []);
    let statusTimestampPairArray = new Array();
    for (let i = 1; i < sensorStatus.length; i++) {
      if ((sensorStatus[i-1].isAvailable == true) && (sensorStatus[i].isAvailable == false)){
        statusTimestampPairArray.push([sensorStatus[i-1].dataTimestamp >= dateStart? sensorStatus[i-1].dataTimestamp: dateStart,
                                       sensorStatus[i].dataTimestamp, 0])
      }
      else if ((sensorStatus[i-1].isAvailable == true) && (sensorStatus[i].isAvailable == true)){
        statusTimestampPairArray.push([sensorStatus[i-1].dataTimestamp >= dateStart? sensorStatus[i-1].dataTimestamp: dateStart,
          sensorStatus[i].dataTimestamp, 1])
      }
    }

    if (sensorStatus.length > 0) {
      statusTimestampPairArray.push(
        [sensorStatus[sensorStatus.length-1].dataTimestamp >= dateStart? sensorStatus[sensorStatus.length-1].dataTimestamp: dateStart,
         dateStart == new Date().setHours(0, 0, 0, 0)? new Date().getTime() : new Date(date).setHours(23, 59, 59, 999), 0])
    }

    let locationSets = await Promise.all(statusTimestampPairArray.map((d) =>
      this.findLocation({
        where: {dataTimestamp: Between(d[0], d[1])}
      })
    ))

    let iodoorDatas = locationSets.map((d: Array<LocationEntity>, i) => {
      // create mock LocationEntity when location sensor on or off, and let it indoor score
      // equal to 0
      let mockLocationEntityStart = new LocationEntity()
      mockLocationEntityStart.dataTimestamp = statusTimestampPairArray[i][0]
      mockLocationEntityStart.accuracy = 10;
      mockLocationEntityStart.provider = 'network'
      d.unshift(mockLocationEntityStart);

      if (statusTimestampPairArray[i][2] == 0){
        let mockLocationEntityEnd = new LocationEntity()
        mockLocationEntityEnd.dataTimestamp = statusTimestampPairArray[i][1]
        mockLocationEntityEnd.accuracy = 10;
        mockLocationEntityEnd.provider = 'network'
        d.push(mockLocationEntityEnd);
      }

      return this.dataProcessService.computeIodoor(d, date)
    })

    let iodoorData = new IodoorDataEntity();
    iodoorData.dateString = this.datetimeService.timeToDateString(date);
    iodoorDatas.forEach((d) => {
      iodoorData.addIndoorTime(d.indoorTime);
      iodoorData.addOutdoorTime(d.outdoorTime);
    })

    return iodoorData
  }

  async getDailyAirQuality(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      this.findAirQuality(this.DailyTimestampRangeOptions(date))
      .then(res => resolve(res))
      .catch(e => reject(e));
    })
  }

  async getDailyWeather(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      this.findWeather(this.DailyTimestampRangeOptions(date))
      .then(res => resolve(res))
      .catch(e => reject(e));
    })
  }

  async getDateWithAvailableData(): Promise<Array<string>>{
    return new Promise<Array<string>>(resolve => {
      let findEnv = new Promise((resolve, reject) => {
        let arr = [];
        this.findEnvMeta().then((res: Array<EnvMetaEntity>) => {
          res.forEach(entity => arr.push(entity.dateString));
          resolve(arr);
        });
      });
      let findIodoor = new Promise(resolve => {
        let arr = [];
        this.findIodoorMeta().then((res: Array<IodoorMetaEntity>) => {
          res.forEach(entity => arr.push(entity.dateString));
          resolve(arr);
        });
      });
      let findSteps = new Promise(resolve => {
        let arr = [];
        this.findStepsMeta().then((res: Array<StepsMetaEntity>) => {
          res.forEach(entity => arr.push(entity.dateString));
          resolve(arr);
        });
      });
      Promise.all([findEnv, findIodoor, findSteps]).then(([env, iodoor, steps]: any) => {
        let ret = env.concat(iodoor, steps);
        let uniqueFilter = (arr) => arr.filter((v,i) => arr.indexOf(v) === i);
        ret = uniqueFilter(ret.sort().reverse());
        resolve(ret);
      });
    });
  }

  async generateSleepActivityData(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      this.findPedometer(this.SleepActivityOptions(date))
        .then((data: Array<PedometerEntity>) => {
          let sleepActivity = this.dataProcessService.computeSleepActivity(data, date);
          this.saveSleepActivity(sleepActivity).then(res => resolve(res)).catch(e => reject(e));
        }).catch(e => reject(e));
    })
  }

  async getLatestLocationData() {
    return new Promise ((resolve, reject) => {
      this.findLocation({order: {dataTimestamp: 'DESC'}, take: 1}).then((res) => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async getUnsentEnvMeta() {
    return new Promise((resolve, reject) => {
      this.findEnvMeta(this.UnsentMetaOptions()).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

  async getUnsentIodoorMeta() {
    return new Promise((resolve, reject) => {
      this.findIodoorMeta(this.UnsentMetaOptions()).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

  async getUnsentStepsMeta() {
    return new Promise((resolve, reject) => {
      this.findStepsMeta(this.UnsentMetaOptions()).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

  async modifyLatestCustomClassRecord(customClass: CustomClassEntity, value: number) {
    return new Promise((resolve, reject) => {
      customClass.records[0].value += value;
      customClass.records[0].dateTimeStamp = new Date().getTime();
      this.customClassRecordRepository.save(customClass.records[0]).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    });
  }

  async saveConfig(configEntity: ConfigEntity) {
    return new Promise((resolve, reject) => {
      this.configRepository.save(configEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveLocation(locationEntity: LocationEntity) {
    return new Promise((resolve, reject) => {
      this.locationRepository.save(locationEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveLocationStatus(locationStatusEntity: LocationStatusEntity) {
    return new Promise((resolve, reject) => {
      this.locationStatusRepository.save(locationStatusEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async savePedometer(pedometerEntity: PedometerEntity) {
    return new Promise((resolve, reject) => {
      this.pedometerRepository.save(pedometerEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async savePedometerStatus(pedometerStatusEntity: PedometerStatusEntity) {
    return new Promise((resolve, reject) => {
      this.pedometerStatusRepository.save(pedometerStatusEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveGyroscope(gyroscopeEntity: GyroscopeEntity) {
    return new Promise((resolve, reject) => {
      this.gyroscopeRepository.save(gyroscopeEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveEnvMeta(envMetaEntity: EnvMetaEntity) {
    return new Promise((resolve, reject) => {
      this.envMetaRepository.save(envMetaEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveIodoorData(iodoorDataEntity: IodoorDataEntity) {
    return new Promise((resolve, reject) => {
      this.iodoorDataRepository.save(iodoorDataEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveIodoorMeta(iodoorMetaEntity: IodoorMetaEntity) {
    return new Promise((resolve, reject) => {
      this.iodoorMetaRepository.save(iodoorMetaEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveStepsData(stepsDataEntity: StepsDataEntity) {
    return new Promise((resolve, reject) => {
      this.stepsDataReposiotry.save(stepsDataEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveStepsMeta(stepsMetaEntity: StepsMetaEntity) {
    return new Promise((resolve, reject) => {
      this.stepsMetaReposiotry.save(stepsMetaEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveSleepActivity(sleepActivityEntity: SleepActivityEntity) {
    return new Promise((resolve, reject) => {
      this.sleepActivityRepository.save(sleepActivityEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveWeather(weatherEntity: WeatherEntity) {
    return new Promise((resolve, reject) => {
      this.weatherRepository.save(weatherEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  async saveAirQuality(airQualityEntity: AirQualityEntity) {
    return new Promise((resolve, reject) => {
      this.airQualityRepository.save(airQualityEntity).then(res => {
        resolve(res);
      }).catch(e => reject(e));
    })
  }

  private DailyTimestampRangeOptions(date: Date) {
    return {
      where: {
        dataTimestamp: Between(new Date(date).setHours(0, 0, 0, 0),
                               new Date(date).setHours(23, 59, 59, 999))
      }
    }
  }

  private DailyRangeOptions(date: Date) {
    return {
      where: {
        dateString: this.datetimeService.timeToDateString(date)
      }
    }
  }

  private SleepActivityOptions(date: Date) {
    let startDate = this.datetimeService.getDaysBefore(new Date(date), 1);

    return {
      where: {
        dataTimestamp: Between(startDate,
                               new Date(date).setHours(23, 59, 59, 999))
      }
    }
  }

  private UnsentMetaOptions() {
    let today = this.datetimeService.timeToDateString(new Date());
    let lastMonth = this.datetimeService.getDaysBefore(today, 30);
    return {
      where: {
        hasSentData: 0,
        dateString: Between(today, lastMonth)
      }
    }
  }

  async getStepsByDate(endDate: Date = null, howManyDays: number = 0){
    // this function is for getting several days steps data,
    // and the array records days with no data
    let days = d3.range(howManyDays - 1, -1, -1)
    .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    let preDaysSteps = await Promise.all(days.map((d) => this.getDailyStepsDataStepsOnly(d)));

    let stepsHollow = new Array(preDaysSteps.length);
    let daysSteps = new Array(preDaysSteps.length);
    preDaysSteps.forEach((d, i) => {
      if (d == -1) {
        stepsHollow[i] = 1;
        daysSteps[i] = 0;
      }
      else {
        stepsHollow[i] = 0;
        daysSteps[i] = d;
      }
    });

    return [daysSteps, stepsHollow]
  }

  async getIodoorByDate(endDate: Date = null, howManyDays: number = 0){
    // this function is for getting several days iodoor data,
    // and the array records days with no data
    let days = d3.range(howManyDays - 1, -1, -1)
    .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    let sevenDaysIodoor = await Promise.all<IodoorDataEntity>(days.map((d) => this.getDailyIodoorData(d)));

    let sevenDaysIndoor = sevenDaysIodoor.map(d => d.indoorPercent);
    let sevenDaysOutdoor = sevenDaysIodoor.map(d => d.outdoorPercent);
    let iodoorHollow = sevenDaysIodoor.map(d => {
      if (d.outdoorPercent == 0 && d.indoorPercent == 0) {
        console.debug('no in/outdoor data');
        return 1
      }
      else {
        return 0
      }
    });

    return [sevenDaysIndoor, sevenDaysOutdoor, iodoorHollow]
  }

  async getSleepByDate(endDate: Date = null, howManyDays: number = 0){
    // this function is for getting several days sleep data,
    // and the array records days with no data

    let days = d3.range(howManyDays - 1, -1, -1)
    .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    let preDaysSleep = await Promise.all<SleepActivityEntity>(days.map((d) => this.getDailySleepActivity(d)));

    let daysSleep = new Array(preDaysSleep.length);
    let sleepHollow = new Array(preDaysSleep.length);

    preDaysSleep.forEach((d, i) => {
      if (d.isValid()) {
        daysSleep[i] = d
        sleepHollow[i] = 0
      }
      else {
        console.debug('no sleep data');
        let mockSleepActivity = new SleepActivityEntity();
        daysSleep[i] = mockSleepActivity;
        sleepHollow[i] = 1
      }
    });

    // why subtract with 4:00 is that the method we calculate wokeup time,
    // we take the first steps event time after 4:00 as the time one woke-up
    let daysWokeupTimeDiff = daysSleep.map((d, i) => {
      if (d.wokeupTimestamp != 0) {
        return d.wokeupTimestamp - new Date(days[i]).setHours(4, 0, 0, 0)
      }
      else {
        return 0
      }
    });

    let daysSleepingTime = daysSleep.map(d => d.sleepDuration);

    return [daysWokeupTimeDiff, daysSleepingTime, sleepHollow]
  }

  async getWeatherByDate(endDate: Date = null, howManyDays: number = 0){
    // this function is for getting several days weather data,
    // and the array records days with no data

    let days = d3.range(howManyDays - 1, -1, -1)
    .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    let preDaysWeather = await Promise.all<Array<WeatherEntity>>(days.map((d) => this.getDailyWeather(d)));

    let daysWeather = new Array(preDaysWeather.length);
    let weatherHollow = new Array(preDaysWeather.length);

    preDaysWeather.forEach((d, i) => {
      if (d.length == 0) {
        console.debug('no weather data');
        daysWeather[i] = [0, 0]
        weatherHollow[i] = 1
      }
      else {
        daysWeather[i] = [
          d.reduce((accu, curr) => accu + curr.tempCelsius, 0) / d.length,
          d.reduce((accu, curr) => accu + curr.humidity, 0) / d.length
        ]
        weatherHollow[i] = 0
      }
    });

    let daysTempCelsius = daysWeather.map(d => d[0]);
    let daysHumidity = daysWeather.map(d => d[1]);

    return [daysTempCelsius, daysHumidity, weatherHollow]
  }

  async getAQIByDate(endDate: Date = null, howManyDays: number = 0){
    // this function is for getting several days AQI data,
    // and the array records days with no data

    let days = d3.range(howManyDays - 1, -1, -1)
    .map((d) => new Date(new Date(endDate).setHours(0, 0, 0, 0) - d * 86400000));

    let preDaysAQI = await Promise.all<Array<AirQualityEntity>>(days.map((d) => this.getDailyAirQuality(d)));

    let daysAQI = new Array(preDaysAQI.length);
    let AQIHollow = new Array(preDaysAQI.length);

    preDaysAQI.forEach((d, i) => {
      if (d.length == 0) {
        console.debug('no AQI data');
        daysAQI[i] = 0
        AQIHollow[i] = 1
      }
      else {
        daysAQI[i] = d.reduce((accu, curr) => accu + curr.aqi, 0) / d.length
        AQIHollow[i] = 0
      }
    });

    return [daysAQI, AQIHollow]
  }

  async getJournalDataByDate(endDate: Date = null, howManyDays: number = 0){
    // this function is for getting several days data set for journal chart,
    // and the arrays records days with no data

    let steps, iodoors, sleeps, weathers, AQIs;
    [steps, iodoors, sleeps, weathers, AQIs] = await Promise.all(
      [this.getStepsByDate(endDate, howManyDays),
       this.getIodoorByDate(endDate, howManyDays),
       this.getSleepByDate(endDate, howManyDays),
       this.getWeatherByDate(endDate, howManyDays),
       this.getAQIByDate(endDate, howManyDays)]
    )

    let dataArray = [steps[0], iodoors[1],
                     sleeps[1], sleeps[0],
                     weathers[0], weathers[1],
                     AQIs[0]];

    let hollowArray = [steps[1], iodoors[2],
                       sleeps[2], sleeps[2],
                       weathers[2], weathers[2],
                       AQIs[1]];

    return [dataArray, hollowArray]
  }

  async getSingleCustomClassData(date: Date = null, classID: number = null){
    // this function is for getting several days custom class data,
    // and the array records days with no data
    if (!date) date = new Date();
    return new Promise<CustomClassEntity>((resolve, reject) => {
       this.customClassRepository
      .createQueryBuilder('customClass')
      .leftJoinAndSelect(
        'customClass.records',
        'custom_class_record_entity'
      )
      .where("customClass.id = :id", {id: classID})
      .getMany()
      .then(singleClass => {
        singleClass[0].records = singleClass[0].records.filter(d =>
          d.dateTimeStamp >= new Date(date).setHours(0, 0, 0, 0) &&
          d.dateTimeStamp <= new Date(date).setHours(23, 59, 59, 999)
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

}
