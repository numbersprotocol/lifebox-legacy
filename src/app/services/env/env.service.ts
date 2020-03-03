import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { DataRenderService } from '../data-render/data-render.service';
import { AirQualityEntity } from 'src/app/entities/airquality.entity';
import { RestService } from '../rest/rest.service';
import { LocationCoordinate, AirQualityStatus } from 'src/app/models/env.model';
import { RepoService } from '../repo/repo.service';
import { WeatherEntity } from 'src/app/entities/weather.entity';
import { WeatherResponse, AirQualityResponse } from 'src/app/models/api-response.model';
import { DataProcessService } from '../data-process/data-process.service';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})

export class EnvService {
  coordinate: LocationCoordinate = {
    latitude: null,
    longitude: null,
  };

  constructor(
    private dataService: DataService,
    private loginService: LoginService,
    private restService: RestService,
    private repoService: RepoService,
  ) { }

  async addAirQualityData() {
    return new Promise((resolve, reject) => {
      this.getLatestCoordinate()
      .then(coordinate => this.getAirQualityByCoordinate(coordinate))
      .then(entity => this.repoService.saveAirQuality(entity))
      .then(() => resolve())
      .catch(() => {
      this.getCity()
      .then(city => this.getAirQualityByCity(city))
      .then(entity => this.repoService.saveAirQuality(entity))
      .then(() => resolve())
      .catch(e => reject(e));
      });
    });
  }

  async addWeatherData() {
    return new Promise((resolve, reject) => {
      this.getLatestCoordinate()
      .then(coordinate => this.getWeatherByCoordinate(coordinate))
      .then(entity => this.repoService.saveWeather(entity))
      .then(() => resolve())
      .catch(() => {
      this.getCity().then(city => this.getWeatherByCity(city))
      .then(entity => this.repoService.saveWeather(entity))
      .then(() => resolve())
      .catch(e => reject(e));
      });
    });
  }

  async fetchEnv() {
    const pAirQuality = this.addAirQualityData().catch(e => console.log(e));
    const pWeather = this.addWeatherData().catch(e => console.log(e));
    return Promise.all([pAirQuality, pWeather]);
  }

  async getAirQualityByCoordinate(coordinate: LocationCoordinate) {
    return new Promise<AirQualityEntity>((resolve, reject) => {
      this.restService.getAirQualityByCoordinate(coordinate.latitude, coordinate.longitude)
      .then(res => {
        resolve(this.createAirQualityEntity(res));
      }).catch(e => reject(e));
    });
  }

  async getAirQualityByCity(city: string) {
    return new Promise<AirQualityEntity>((resolve, reject) => {
      this.restService.getAirQualityByCity(city)
      .then(res => {
        resolve(this.createAirQualityEntity(res));
      }).catch(e => reject(e));
    });
  }

  async getCity() {
    return new Promise<string>((resolve, reject) => {
      this.restService.getProfile(this.loginService.session.uid).then(profile => {
        resolve(profile.city);
      }).catch(e => reject(e));
    });
  }

  async getLatestCoordinate() {
    return new Promise<LocationCoordinate>((resolve, reject) => {
      this.dataService.getLatestLocationData().then(res => {
        const coordinate = {
          latitude: res.latitude,
          longitude: res.longitude,
        };
        resolve(coordinate);
      }).catch(e => reject(e));
    });
  }

  async getWeatherByCoordinate(coordinate: LocationCoordinate) {
    return new Promise<WeatherEntity>((resolve, reject) => {
      this.restService.getWeatherByCoordinate(coordinate.latitude, coordinate.longitude)
      .then(res => {
        resolve(this.createWeatherEntity(res));
      }).catch(e => reject(e));
    });
  }

  async getWeatherByCity(city: string) {
    return new Promise<WeatherEntity>((resolve, reject) => {
      this.restService.getWeatherByCity(city)
      .then(res => {
        resolve(this.createWeatherEntity(res));
      }).catch(e => reject(e));
    });
  }

  async getYesterdayAqiLevelDiff(aqiLevel: number) {
    return new Promise<number>((resolve, reject) => {
      this.dataService.getAverageAqiByDate(this.getYesterday())
      .then(avgAqi => {
        const avgAqiStatus = new AirQualityStatus(avgAqi);
        resolve(aqiLevel - avgAqiStatus.level);
      }).catch(e => reject(e));
    });
  }

  async getYesterdayHumidityDiff(humidity: number) {
    return new Promise<number>((resolve, reject) => {
      this.dataService.getAverageHumidityByDate(this.getYesterday())
      .then(avgHumidity => {
        resolve(humidity - avgHumidity);
      }).catch(e => reject(e));
    });
  }

  async getYesterdayTempCelsiusDiff(temp: number) {
    return new Promise<number>((resolve, reject) => {
      this.dataService.getAverageTempCelsiusByDate(this.getYesterday())
      .then(avgTemp => {
        resolve(temp - avgTemp);
      }).catch(e => reject(e));
    });
  }

  private createAirQualityEntity(airQuality: AirQualityResponse) {
    const entity = new AirQualityEntity();
    entity.dataTimestamp = Date.now();
    entity.aqi = airQuality.data.aqi;
    return entity;
  }

  private createWeatherEntity(weather: WeatherResponse) {
    const entity = new WeatherEntity();
    entity.dataTimestamp = Date.now();
    entity.humidity = weather.main.humidity;
    entity.latitude = weather.coord.lat;
    entity.longitude = weather.coord.lon;
    entity.tempCelsius = weather.main.temp;
    return entity;
  }

  private getYesterday() {
    const date = new Date();
    return new Date(date.setDate(date.getDate() - 1));
  }

}
