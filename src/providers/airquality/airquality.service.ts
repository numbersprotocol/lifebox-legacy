import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../data/data.service';
import { AirQualityEntity } from '../../entities/airquality.entity';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { CommService } from '../comm/comm.service';

/* Air quality provider powered by aqicn.org
 *
 * More details about the current weather data API:
 * https://aqicn.org/api/
 */
@Injectable()
export class AirQualityService {
  private token:string = '0d6fe4d14e1317da3d08c85327831f634082b3df';
  latestLatitude:number = 0.0;
  latestLongitude:number = 0.0;
  airQualityIndex:number = 0;
  airQualityIndexDiff:string = '-';
  airQualityStatus:string = '';
  timestamp:number = Date.now();

  constructor(private commService: CommService,
              public dataService: DataService,
              public http: HttpClient) {
  }

  async fetchCurrentAirQuality() {
    return new Promise((resolve, reject) => {
      this.updateLatestLocation()
      .then(res => this.getAirQualityByLocation(res))
      .then(res => this.updateAqi(res))
      .then(res => this.updateAqiDiff(res))
      .then(() => this.getAqiCache())
      .then((ad) => {
        this.saveAirQualityData(ad).then(() => {
          this.dataService.addEnvMeta().then(() => {
            this.commService.sendEnvMeta();
          }).catch(e => console.debug(e));
          resolve();
        });
      }).catch(e => reject(e));
    });
  }

  getAirQualityByCity(city) {
    return this.http.get('http://api.waqi.info/feed/' + city + '/?token=' + this.token)
                    .map((res:Response) => res)
                    .catch((error:any) => Observable.throw(error.error+ 'Server error'));
  }

  getAirQualityByLocation(location) {
    return new Promise((resolve, reject) => {
      let aqiData = {};
      this.http
          .get('http://api.waqi.info/feed/geo:'
               + location['latitude']
               + ';'
               + location['longitude']
               + '/?token='
               + this.token)
          .map((res:Response) => res)
          .catch((error:any) => Observable.throw(error.error+ 'Server error'))
          .subscribe((res) => {
            aqiData = {
              'aqi': res['data']['aqi'],
              'status': this.getAirQualityStatus(res['data']['aqi']),
              'timestamp': Date.now()
            }

            resolve(aqiData);
          });
    });
  }

  getAirQualityStatus(aqi) {
    if (aqi <= 50) {
      return 'Good';
    } else if (aqi <= 100) {
      return 'Moderate';
    } else if (aqi <= 200) {
      return 'Unhealthy';
    } if (aqi <= 300) {
      return 'Very Unhealthy';
    } else if (aqi > 300) {
      return 'Hazardous';
    } else {
      return 'Unknown';
    }
  }

  /* Larger is better
   */
  getAirQualityLevel(aqi) {
    if (aqi <= 50) {
      return 5;
    } else if (aqi <= 100) {
      return 4;
    } else if (aqi <= 200) {
      return 3;
    } if (aqi <= 300) {
      return 2;
    } else if (aqi > 300) {
      return 1;
    } else {
      return null;
    }
  }

  getYesterdayDiff(aqi: number, date: Date) {
    return new Promise((resolve, reject) => {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let diff = {'aqiDiff': 0};

      this.getDayAverage(yesterday)
        .then(avg => {
          diff = {
            'aqiDiff': aqi - avg['aqiAverage']
          }
          resolve(diff);
        })
        .catch(e => reject(e));
    });
  }

  private getDayAverage(date: Date) {
    return new Promise((resolve, reject) => {
      this.dataService.getDailyAirQuality(date)
        .then((data: Array<AirQualityEntity>) => {
          let aqiSum = 0;
          let avg = {'aqiAverage': 0};

          console.debug('[AqiService] data array');
          console.debug(data);
          console.debug('[AqiService] data length: ' + data.length);
          for (let i = 0; i < data.length; i++) {
            aqiSum += data[i].aqi;
          }
          avg = {
            'aqiAverage': aqiSum / data.length
          };
          console.debug('[AqiService] avg');
          console.debug(avg);

          resolve(avg);
        }).catch(e => reject(e));
    });
  }

  saveAirQualityData(aqiData) {
    return new Promise((resolve, reject) => {
      let data = this.createAirQualityEntity(
                        aqiData['aqi'],
                        aqiData['timestamp']);
      this.dataService.saveAirQuality(data)
        .then(res => { resolve(res); })
        .catch(e => { reject(e); });
    });
  }

  private createAirQualityEntity(aqi: number, timestamp: number) {
    let airQualityEntity = new AirQualityEntity();
    airQualityEntity.aqi = aqi;
    airQualityEntity.dataTimestamp = timestamp;
    return airQualityEntity;
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
        console.debug('[AqiService] latest location');
        console.debug(this.latestLatitude);
        console.debug(this.latestLongitude);
      }).catch(error => {
        this.latestLatitude = null;
        this.latestLongitude = null;
        console.warn('[AqiService] Failed to get latest location from db');
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

  /* Get air quality index by location from aqi service
   * powered by aqicn.org.
   */
  updateAqi(aqi) {
    return new Promise((resolve, reject) => {
      this.airQualityIndex = aqi['aqi'];
      this.airQualityStatus = aqi['status'];
      this.timestamp = aqi['timestamp'];

      resolve({
        'aqi': this.airQualityIndex,
        'timestamp': this.timestamp
      });
    });
  }

  /* Aqi diff with yesterday's average will be updated on home.
   */
  updateAqiDiff(aqi) {
    return new Promise((resolve, reject) => {
      this.getYesterdayDiff(aqi['aqi'], new Date())
        .then(diff => {
          let aqiLvToday = this.getAirQualityLevel(aqi['aqi']);
          let aqiLvYesterday = this.getAirQualityLevel(
                                      aqi['aqi'] - diff['aqiDiff']);
          let lvDiff = aqiLvToday - aqiLvYesterday;

          if (lvDiff > 0) {
            this.airQualityIndexDiff = '+Lv'
            this.airQualityIndexDiff += lvDiff.toString();
          } else if (lvDiff == 0) {
            this.airQualityIndexDiff = 'Same'
          } else {
            this.airQualityIndexDiff = '-Lv'
            this.airQualityIndexDiff += (lvDiff * -1).toString();
          }

          resolve({
            'aqiDiff': this.airQualityIndexDiff
          });
        })
        .catch(() => {
          reject({
            'aqiDiff': '-'
          });
        });
    });
  }

  getAqiCache() {
    return new Promise((resolve, reject) => {
      resolve({
        'latestLatitude': this.latestLatitude,
        'latestLongitude': this.latestLongitude,
        'aqi': this.airQualityIndex,
        'status': this.airQualityStatus,
        'aqiDiff': this.airQualityIndexDiff,
        'timestamp': this.timestamp
      });
    });
  }
}
