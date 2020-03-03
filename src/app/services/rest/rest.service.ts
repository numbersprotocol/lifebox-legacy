import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiUrl } from 'src/app/models/api-url.model';
import { AirQualityResponse, EmailResponse, LoginApiResponse, LoginResponse, SignupResponse,
  WeatherResponse } from 'src/app/models/api-response.model';
import { QuickLoginPayload, LoginPayload, ProfilePayload, SignupPayload } from 'src/app/models/api-payload.model';
import { Metadata } from 'src/app/models/metadata.model';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) {}

  async getAirQualityByCity(city: string) {
    return new Promise<AirQualityResponse>((resolve, reject) => {
      this.http.get<AirQualityResponse>(ApiUrl.airQualityByCity(city))
        .subscribe(
          res => resolve(res),
          e => reject(e)
        );
    });
  }

  async getAirQualityByCoordinate(latitude: number, longitude: number) {
    return new Promise<AirQualityResponse>((resolve, reject) => {
      this.http.get<AirQualityResponse>(ApiUrl.airQualityByCoordinate(latitude, longitude))
        .subscribe(
          res => resolve(res),
          e => reject(e)
        );
    });
  }

  async getEmail(email: string) {
    return new Promise<EmailResponse>((resolve, reject) => {
      this.http.get<EmailResponse>(ApiUrl.email(), { params: { email } })
        .subscribe(
          res => resolve(res),
          e => reject(e)
        );
    });
  }

  async getProfile(uid: number) {
    return new Promise<ProfilePayload>((resolve, reject) => {
      this.http.get<ProfilePayload>(ApiUrl.profile(uid), this.httpOptions)
      .subscribe(
        res => resolve(res),
        e => reject(e));
    });
  }

  async getProfileSchema(uid: number) {
    return new Promise<{}>((resolve, reject) => {
      this.http.get<{}>(ApiUrl.profileSchema(uid), this.httpOptions)
      .subscribe(
        res => resolve(res),
        e => reject(e),
      );
    });
  }

  async getWeatherByCity(city: string) {
    return new Promise<WeatherResponse>((resolve, reject) => {
      this.http.get<WeatherResponse>(ApiUrl.weatherByCity(city))
      .subscribe(
        res => resolve(res),
        e => reject(e),
      );
    });
  }

  async getWeatherByCoordinate(latitude: number, longitude: number) {
    return new Promise<WeatherResponse>((resolve, reject) => {
      this.http.get<WeatherResponse>(ApiUrl.weatherByCoordinate(latitude, longitude))
      .subscribe(
        res => resolve(res),
        e => reject(e),
      );
    });
  }

  async postLogin(loginPayload: LoginPayload) {
    return this.http.post<LoginResponse>(ApiUrl.loginApi(), loginPayload, this.httpOptions).toPromise();
  }

  async postQuickLogin(quickLoginPayload: QuickLoginPayload) {
    return this.http.post<QuickLoginPayload>(ApiUrl.quickLogin(), quickLoginPayload, {}).toPromise();
  }

  async signup(signupPayload: SignupPayload) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<SignupResponse>(ApiUrl.signupApi(), signupPayload, this.httpOptions)
        .subscribe((res: SignupResponse) => {
          if (res.success === true) {
            resolve(res.success);
          } else {
            reject('Signup failed: ' + res.error);
          }
        }, e => {
          console.log(e);
          reject('Signup post failed: ' + e);
        });
    });
  }

  async patchProfile(uid: number, profilePayload: ProfilePayload) {
    return new Promise<ProfilePayload>((resolve, reject) => {
      console.log('PATCH with payload: ', profilePayload);
      this.http.patch<ProfilePayload>(ApiUrl.profile(uid), profilePayload, this.httpOptions)
      .subscribe(
        res => resolve(res),
        e => reject(e),
      );
    });
  }

  async postEnvMeta(metadata: Metadata) {
    return new Promise((resolve, reject) => {
      this.http.post<Metadata>(ApiUrl.envMeta(), metadata, this.httpOptions)
        .subscribe(res => {
          console.log('POST env metadata ', res);
          resolve(res);
        }, e => {
          console.log(e);
          reject(e);
        });
    });
  }

  async postIodoorMeta(metadata: Metadata) {
    return new Promise((resolve, reject) => {
      this.http.post<Metadata>(ApiUrl.iodoorMeta(), metadata, this.httpOptions)
        .subscribe(res => {
          console.log('POST iodoor metadata ', res);
          resolve(res);
        }, e => {
          console.log(e);
          reject(e);
        });
    });
  }

  async postStepsMeta(metadata: Metadata) {
    return new Promise((resolve, reject) => {
      this.http.post<Metadata>(ApiUrl.stepsMeta(), metadata, this.httpOptions)
        .subscribe(res => {
          console.log('POST env metadata ', res);
          resolve(res);
        }, e => {
          console.log(e);
          reject(e);
        });
    });
  }

  getWeb3Token() {
    return new Promise<string>((resolve, reject) => {
      this.http.get<LoginApiResponse>(ApiUrl.loginApi(), this.httpOptions).toPromise()
      .then(res => resolve(res.data))
      .catch(e => reject(e));
    });
  }

}
