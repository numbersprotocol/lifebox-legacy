import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../data/data.service';
import { WeatherEntity } from '../../entities/weather.entity';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { CommService } from '../comm/comm.service';

/* Weather provider powered by OpenWeatherMap
 *
 * More details about the current weather data API:
 * https://openweathermap.org/current
 */
@Injectable()
export class WeatherService {
  private apiKey:string = '542ffd081e67f4512b705f89d2a611b2';
  latestLatitude:number = 0.0;
  latestLongitude:number = 0.0;
  weatherTempCelsius:number = 0;
  weatherTempCelsiusDiff:string = 'N/A';
  weatherHumidity:number = 0;
  weatherHumidityDiff:string = '-';
  timestamp:number = Date.now();

  constructor(private commService: CommService,
              private dataService: DataService,
              public http: HttpClient) {
  }

  async fetchCurrentWeather() {
    return new Promise((resolve, reject) => {
      /* NOTE: Don't use the style below for the methods of weatherService
      *       and airQualiryService, otherwise the class methods will not
      *       be called with correct "this" (undefined).
      *
      *   .then(this.weatherService.funcname1)
      *   .then(this.weatherService.funcname2)
      *   ...
      */
      /* Get location from the latest location entry in local database.
      */
      this.updateLatestLocation()
      .then(res => this.getWeatherByLocation(res))
      .then(res => this.updateWeather(res))
      .then(res => this.updateWeatherDiff(res))
      .then(() => this.getWeatherCache())
      .then((wd) => {
        this.saveWeatherData(wd).then(() => {
          this.dataService.addEnvMeta().then(() => {
            this.commService.sendEnvMeta();
          }).catch(e => console.debug(e));
          resolve();
        });
      }).catch(e => reject(e));
    });
  }

  getWeather(country, city) {
    return this.http.get('http://api.openweathermap.org/data/2.5/weather?q='+city+','+country+'&units=metric&APPID='+this.apiKey)
                    .map((res:Response) => res)
                    .catch((error:any) => Observable.throw(error.error+ 'Server error'));
  }

  getWeatherByLocation(location) {
    return new Promise((resolve, reject) => {
      let weatherData = {};
      this.http
          .get('http://api.openweathermap.org/data/2.5/weather?lat='
               + location['latitude']
               + '&lon='
               + location['longitude']
               + '&units=metric&APPID='
               + this.apiKey)
          .map((res:Response) => res)
          .catch((error:any) => Observable.throw(error.error+ 'Server error'))
          .subscribe((res) => {
              weatherData = {
                'tempCelsius': res['main']['temp'],
                'humidity': res['main']['humidity'],
                'timestamp': Date.now()
              }

              resolve(weatherData);
          });
    });
  }

  getWeatherForcast(country, city) {
    return this.http.get('http://api.openweathermap.org/data/2.5/forecast?q='+city+','+country+'&units=metric&APPID='+this.apiKey)
                    .map((res:Response) => res)
                    .catch((error:any) => Observable.throw(error.error+ 'Server error'));
  }

  getWeatherNextWeek(country, city) {
    return this.http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q='+city+','+country+'&units=metric&APPID='+this.apiKey+'&cnt=7')
                    .map((res:Response) => res)
                    .catch((error:any) => Observable.throw(error.error+ 'Server error'));
  }

  getYesterdayDiff(tempCelsius: number,
                   humidity: number,
                   date: Date) {
    return new Promise((resolve, reject) => {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let diff = {
        'tempCelsiusDiff': 0,
        'humidityDiff': 0
      };

      this.getDayAverage(yesterday)
        .then(avg => {
          diff = {
            'tempCelsiusDiff': tempCelsius - avg['tempCelsiusAverage'],
            'humidityDiff': humidity - avg['humidityAverage']
          }
          resolve(diff);
        })
        .catch(reject);
    });
  }

  private getDayAverage(date: Date) {
    return new Promise((resolve, reject) => {
      this.dataService.getDailyWeather(date)
        .then((data: Array<WeatherEntity>) => {
          let tempCelsiusSum = 0;
          let humiditySum = 0;
          let avg = {
            'tempCelsiusAverage': 0,
            'humidityAverage': 0
          };

          console.debug('[WeatherService] data array');
          console.debug(data);
          console.debug('[WeatherService] data length: ' + data.length);
          for (let i = 0; i < data.length; i++) {
            tempCelsiusSum += data[i].tempCelsius;
            humiditySum += data[i].humidity;
          }
          avg = {
            'tempCelsiusAverage': tempCelsiusSum / data.length,
            'humidityAverage': humiditySum / data.length
          };
          console.debug('[WeatherService] data avg');
          console.debug(avg);

          resolve(avg);
        }).catch(e => reject(e));
    });
  }

  saveWeatherData(weatherData) {
    return new Promise((resolve, reject) => {
      let data = this.createWeatherEntity(
                        weatherData['tempCelsius'],
                        weatherData['humidity'],
                        weatherData['latestLatitude'],
                        weatherData['latestLongitude'],
                        weatherData['timestamp']);
      this.dataService.saveWeather(data)
        .then(res => { resolve(res); })
        .catch(e => { reject(e); });
    });
  }

  private createWeatherEntity(tempCelsius: number,
                              humidity: number,
                              latitude: number,
                              longitude: number,
                              timestamp: number) {
    let weatherEntity = new WeatherEntity();
    weatherEntity.tempCelsius= tempCelsius;
    weatherEntity.humidity= humidity;
    weatherEntity.latitude = latitude;
    weatherEntity.longitude= longitude;
    weatherEntity.dataTimestamp = timestamp;
    return weatherEntity;
  }

  /* Get location from the latest location entry in local database.
   */
  async updateLatestLocation() {
    /* Update latest location properties.
     */
    await this.dataService.getLatestLocationData()
      .then(lastLocation => {
        this.latestLatitude = lastLocation[0]['latitude'];
        this.latestLongitude = lastLocation[0]['longitude'];
        console.debug('[WeatherService] latest location');
        console.debug(this.latestLatitude);
        console.debug(this.latestLongitude);
      }).catch(error => {
        this.latestLatitude = null;
        this.latestLongitude = null;
        console.warn('[WeatherService] Failed to get latest location from db');
      });

    return new Promise((resolve, reject) => {
      if (this.latestLatitude != null && this.latestLongitude != null) {
        resolve({
          'latitude': this.latestLatitude,
          'longitude': this.latestLongitude
        });
      } else {
        reject({
          'latitude': null,
          'longitude': null
        });
      }
    });
  }

  /* Get temperature and humidity by location from weather service
   * powered by OpenWeatherMap.
   */
  updateWeather(weather) {
    return new Promise((resolve, reject) => {
      this.weatherTempCelsius = weather['tempCelsius'];
      this.weatherHumidity = weather['humidity'];
      this.timestamp = weather['timestamp'];

      resolve({
        'tempCelsius': this.weatherTempCelsius,
        'humidity': this.weatherHumidity,
        'timestamp': this.timestamp
      });
    });
  }

  /* Weather diff with yesterday's average will be updated on home.
   */
  updateWeatherDiff(weather) {
    return new Promise((resolve, reject) => {
      this.getYesterdayDiff(weather['tempCelsius'],
                            weather['humidity'],
                            new Date())
        .then(diff => {
          this.weatherTempCelsiusDiff = (diff['tempCelsiusDiff'] >= 0) ?
                                        '+' : '';
          this.weatherTempCelsiusDiff += diff['tempCelsiusDiff'].toFixed(2)
                                                                .toString();
          this.weatherHumidityDiff = (diff['humidityDiff'] >= 0) ? 'Higher' : 'Lower';

          resolve({
            'tempCelsiusDiff': this.weatherTempCelsiusDiff,
            'humidityDiff': this.weatherHumidityDiff
          });
        })
        .catch(() => {
          reject({
            'tempCelsiusDiff': 'N/A',
            'humidityDiff': '-'
          });
        });
    });
  }

  getWeatherCache() {
    return new Promise((resolve, reject) => {
      resolve({
        'latestLatitude': this.latestLatitude,
        'latestLongitude': this.latestLongitude,
        'tempCelsius': this.weatherTempCelsius,
        'humidity': this.weatherHumidity,
        'tempCelsiusDiff': this.weatherTempCelsiusDiff,
        'humidityDiff': this.weatherHumidityDiff,
        'timestamp': this.timestamp
      });
    });
  }
}
