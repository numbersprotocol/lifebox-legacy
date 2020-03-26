import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file/ngx';

import { Config } from 'src/app/models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config: Config;
  configFile = 'config.json';
  configPath = this.file.dataDirectory;
  constructor(
    private file: File
    ) {
      this.config = {
        language: 'zh-tw',
        sensors: {
          location: false,
          pedometer: false,
          gyroscope: false,
        },
      };
    }

  async configExists(): Promise<boolean> {
    return this.file.checkFile(this.configPath, this.configFile)
    .then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

  async createConfig() {
    return this.writeConfig(this.config);
  }

  async loadConfig() {
    this.config = await this.readConfig();
  }

  isLocationSensorOn() {
    return this.config.sensors.location;
  }

  isPedometerSensorOn() {
    return this.config.sensors.pedometer;
  }

  isGyroscopeSensorOn() {
    return this.config.sensors.gyroscope;
  }

  getLanguage() {
    return this.config.language;
  }

  async setLanguage(language: string) {
    this.config.language = language;
    return this.writeConfig(this.config);
  }

  toggleLocationSensor(toggle: boolean) {
    this.config.sensors.location = toggle;
    return this.writeConfig(this.config);
  }

  togglePedometerSensor(toggle: boolean) {
    this.config.sensors.pedometer = toggle;
    return this.writeConfig(this.config);
  }

  toggleGyroscopeSensor(toggle: boolean) {
    this.config.sensors.gyroscope = toggle;
    return this.writeConfig(this.config);
  }

  private async readConfig(): Promise<Config> {
    return this.file.readAsText(this.configPath, this.configFile)
    .then(jsonStr => {
      return JSON.parse(jsonStr);
    }).catch(e => {
      throw new Error(e);
    });
  }

  private async writeConfig(config: Config) {
    return this.file.writeFile(this.configPath, this.configFile, JSON.stringify(config), {replace: true});
  }
}
