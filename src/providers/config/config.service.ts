import { Injectable } from '@angular/core';
import { getRepository, Repository } from 'typeorm';

import { ConfigEntity } from '../../entities/config.entity';
import { DataService } from '../data/data.service';

@Injectable()
export class ConfigService {
  constructor(private dataService: DataService) {
  }

  async createConfig() {
    return new Promise((resolve, reject) => {
      let config = new ConfigEntity();
      this.dataService.saveConfig(config).then(res => {
        resolve(res);
        console.debug('Config created');
      }).catch(e => reject(e));
    })
  }

  async isInitialized(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.dataService.findConfig().then((config: ConfigEntity) => {
        (config) ? resolve(true) : resolve(false);
      }).catch(() => resolve(false));
    })
  }

  async isLocationSensorOn(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      this.dataService.findConfig().then((config: ConfigEntity) => {
        resolve(config.locationSensor);
      }).catch(e => reject(e));
    })
  }

  async isPedometerSensorOn(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      this.dataService.findConfig().then((config: ConfigEntity) => {
        resolve(config.pedometerSensor);
      }).catch(e => reject(e));
    })
  }

  async isGyroscopeSensorOn(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      this.dataService.findConfig().then((config: ConfigEntity) => {
        resolve(config.gyroscopeSensor);
      }).catch(e => reject(e));
    })
  }

  async toggleLocationSensor(toggle: boolean) {
    return new Promise((resolve, reject) => {
      this.dataService.findConfig().then((config: ConfigEntity) => {
        config.locationSensor = toggle;
        this.dataService.saveConfig(config).then(res => {
          resolve(res);
        }).catch(e => reject(e));
      }).catch(e => reject(e));
    })
  }

  async togglePedometerSensor(toggle: boolean) {
    return new Promise((resolve, reject) => {
      this.dataService.findConfig().then((config: ConfigEntity) => {
        config.pedometerSensor = toggle;
        this.dataService.saveConfig(config).then(res => {
          resolve(res);
        }).catch(e => reject(e));
      }).catch(e => reject(e));
    })
  }

  async toggleGyroscopeSensor(toggle: boolean) {
    return new Promise((resolve, reject) => {
      this.dataService.findConfig().then((config: ConfigEntity) => {
        config.gyroscopeSensor = toggle;
        this.dataService.saveConfig(config).then(res => {
          resolve(res);
        }).catch(e => reject(e));
      }).catch(e => reject(e));
    })
  }
}
