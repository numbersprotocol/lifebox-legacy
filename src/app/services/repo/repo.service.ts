import { Injectable } from '@angular/core';

import { Repository, FindManyOptions, Connection } from 'typeorm';

import { AirQualityEntity } from '../../entities/airquality.entity';
import { ConfigEntity } from '../../entities/config.entity';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { CustomClassRecordEntity } from '../../entities/customClassRecord.entity';
import { EnvMetaEntity, IodoorMetaEntity, StepsMetaEntity } from '../../entities/metadata.entity';
import { IodoorDataEntity, SleepActivityEntity, StepsDataEntity } from '../../entities/daily-data.entity';
import { LocationEntity } from '../../entities/location.entity';
import { LocationStatusEntity, PedometerStatusEntity } from '../../entities/sensor-status.entity';
import { LogEntity } from 'src/app/entities/log.entity';
import { PedometerEntity } from '../../entities/pedometer.entity';
import { GyroscopeEntity } from '../../entities/gyroscope.entity';
import { Repo } from 'src/app/models/repository.model';
import { WeatherEntity } from '../../entities/weather.entity';

@Injectable({
  providedIn: 'root'
})
export class RepoService {
  connection: Connection;
  repo: Repo;

  constructor() {
    this.repo = new Repo();
  }

  async init() {
    if (this.connection) {
      return;
    }
    this.connection = await this.repo.initCordovaConnection();
  }

  /* FIXME: Should only take 1 latest record instead of all records in desc order*/
  async getCustomClassWithRecordOrderByIdDesc(): Promise<CustomClassEntity[]> {
    return new Promise<CustomClassEntity[]>((resolve, reject) => {
      this.repo.customClass
      .createQueryBuilder('customClass')
      .leftJoinAndSelect('customClass.records', 'records')
      .orderBy('records.id', 'DESC')
      .getMany()
      .then(classes => {
        console.log('dataService.getCustomClassData: ', classes);
        resolve(classes);
      })
      .catch(err => reject(err));
    });
  }

  async getCustomClassWithRecordByDate(date: Date): Promise<CustomClassEntity[]> {
    return new Promise<CustomClassEntity[]>((resolve, reject) => {
      const start = new Date(date).setHours(0, 0, 0, 0);
      const end = new Date(date).setHours(23, 59, 59, 999);
      this.repo.customClass
      .createQueryBuilder('customClass')
      .leftJoinAndSelect('customClass.records', 'records')
      .where(`records.dataTimestamp BETWEEN '${start}' AND '${end}'`)
      .orderBy('records.id', 'DESC')
      .getMany()
      .then(classes => {
        console.log('dataService.getCustomClassWithRecords: ', classes);
        resolve(classes);
      })
      .catch(err => reject(err));
    });
  }

  async countCustomClass() {
    return this.countData(this.repo.customClass);
  }

  async findAirQuality(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.airQuality, findOptions);
  }

  async findConfig(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.config, findOptions);
  }

  async findCustomClass(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.customClass, findOptions);
  }

  async findCustomClassRecord(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.customClassRecord, findOptions);
  }

  async findEnvMeta(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.envMeta, findOptions);
  }

  async findGyroscope(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.gyroscope, findOptions);
  }

  async findIodoorData(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.iodoorData, findOptions);
  }

  async findIodoorMeta(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.iodoorMeta, findOptions);
  }

  async findLocation(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.location, findOptions);
  }

  async findLocationStatus(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.locationStatus, findOptions);
  }

  async findLog(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.log, findOptions);
  }

  async findPedometer(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.pedometer, findOptions);
  }

  async findPedometerStatus(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.pedometerStatus, findOptions);
  }

  async findSleepActivity(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.sleepActivity, findOptions);
  }

  async findStepsData(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.stepsData, findOptions);
  }

  async findStepsMeta(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.stepsMeta, findOptions);
  }

  async findWeather(findOptions: FindManyOptions = null) {
    return this.findData(this.repo.weather, findOptions);
  }

  async removeCustomClass(entities: CustomClassEntity[]) {
    return this.removeData(this.repo.customClass, entities);
  }

  async removeLog(entities: LogEntity[]) {
    return this.removeData(this.repo.log, entities);
  }

  async saveAirQuality(entity: AirQualityEntity) {
    return this.saveData(this.repo.airQuality, entity);
  }

  async saveConfig(entity: ConfigEntity) {
    return this.saveData(this.repo.config, entity);
  }

  async saveCustomClass(entity: CustomClassEntity) {
    return this.saveData(this.repo.customClass, entity);
  }

  async saveCustomClassRecord(entity: CustomClassRecordEntity | CustomClassRecordEntity[]) {
    return this.saveData(this.repo.customClassRecord, entity);
  }

  async saveEnvMeta(entity: EnvMetaEntity) {
    return this.saveData(this.repo.envMeta, entity);
  }

  async saveGyroscope(entity: GyroscopeEntity) {
    return this.saveData(this.repo.gyroscope, entity);
  }

  async saveIodoorData(entity: IodoorDataEntity) {
    return this.saveData(this.repo.iodoorData, entity);
  }

  async saveIodoorMeta(entity: IodoorMetaEntity) {
    return this.saveData(this.repo.iodoorMeta, entity);
  }

  async saveLocation(entity: LocationEntity) {
    return this.saveData(this.repo.location, entity);
  }

  async saveLocationStatus(entity: LocationStatusEntity) {
    return this.saveData(this.repo.locationStatus, entity);
  }

  async saveLog(entity: LogEntity) {
    return this.saveData(this.repo.log, entity);
  }

  async savePedometer(entity: PedometerEntity) {
    return this.saveData(this.repo.pedometer, entity);
  }

  async savePedometerStatus(entity: PedometerStatusEntity) {
    return this.saveData(this.repo.pedometerStatus, entity);
  }

  async saveStepsData(entity: StepsDataEntity) {
    return this.saveData(this.repo.stepsData, entity);
  }

  async saveStepsMeta(entity: StepsMetaEntity) {
    return this.saveData(this.repo.stepsMeta, entity);
  }

  async saveSleepActivity(entity: SleepActivityEntity) {
    return this.saveData(this.repo.sleepActivity, entity);
  }

  async saveWeather(entity: WeatherEntity) {
    return this.saveData(this.repo.weather, entity);
  }

  private async countData<T>(repository: Repository<T>) {
    return new Promise<number>((resolve, reject) => {
      repository.count()
      .then(res => resolve(res))
      .catch(e => reject(e));
    });
  }

  private async findData<T>(repository: Repository<T>, findOptions: FindManyOptions = null) {
    return new Promise<T[]>((resolve, reject) => {
      repository.find(findOptions)
      .then(res => resolve(res))
      .catch(e => reject(e));
    });
  }

  private async removeData<T>(repository: Repository<T>, entities: T[]) {
    return new Promise((resolve, reject) => {
      repository.remove(entities)
      .then(res => resolve(res))
      .catch(e => reject(e));
    });
  }

  private async saveData<T>(repository: Repository<T>, entity: T) {
    return new Promise<T>((resolve, reject) => {
      repository.save(entity)
      .then(res => resolve(res))
      .catch(e => reject(e));
    });
  }
}
