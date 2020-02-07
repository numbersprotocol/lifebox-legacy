import { File } from '@ionic-native/file/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Account, EncryptedKeystoreV3Json } from 'web3-eth-accounts';
import Web3 from 'web3';

import { EnvMetaEntity ,IodoorMetaEntity, StepsMetaEntity } from '../../entities/metadata.entity';
import { Metadata } from '../../types/metadata.type';
import { Profile } from '../../types/profile.type'
import { Signup } from '../../types/signup.type';

@Injectable()
export class RestService {
  hostUrl: string = 'https://numbers.ktx.tw';
  apiUrl: string = this.hostUrl + '/api/v1';
  web3: Web3 = new Web3('http://localhost:8545');
  uid: number = -1;
  web3Token: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public http: HttpClient, private file: File) {
    this.web3Token = localStorage.getItem('web3Token');
    if (this.web3Token) {
      this.httpOptions['headers'] = this.httpOptions['headers'].append('Authorization', 'Web3Token ' + this.web3Token);
    }
  }

  _reset_token(web3Token: string) {
    localStorage.setItem('web3Token', web3Token);
    this.httpOptions['headers'] = this.httpOptions['headers'].set('authorization', 'Web3Token ' + web3Token);
  }
  createFormHeader(csrfToken: string) {
    return {
      headers: new HttpHeaders({
        'X-CSRFToken': csrfToken
      })
    };
  }

  getProfileSchema() {
    return new Promise<Object>((resolve, reject) => {
      this.http.get(this.apiUrl + '/users/' + this.uid + '/schema/', this.httpOptions)
      .subscribe(response => {
        if (response) {
          resolve(response)
        }
      }, err => {
        reject(err);
      });
    });
  }

  getSigninToken() {
    return new Promise<string> ((resolve, reject) => {
      this.http.get(this.apiUrl + '/login_api/', this.httpOptions)
      .subscribe(response => {
        if (response['success']) {
          resolve(response['data']);
        }
      }, err => {
        reject(err);
      });
    });
  }

 async login(keyFile: string) {
    let token: string = <string> await this.getSigninToken();

    let res = this.file.readAsText(this.file.dataDirectory, keyFile)
    .then(fileStr => {
      return new Promise<Account> ((resolve, reject) => {
        var fileContent: EncryptedKeystoreV3Json;
        fileContent = JSON.parse(fileStr);
        resolve(this.web3.eth.accounts.decrypt(fileContent, ''));
      });
    })
    .then(web3Account => {
      return new Promise<Object>((resolve, reject)=> {
        let loginData = {
          address: this.web3.utils.toHex(web3Account.address),
          signature: web3Account.sign(token).signature,
          token: token
        }
        this.http.post(this.apiUrl + '/login_api/', loginData, this.httpOptions)
        .subscribe(response => {
          resolve(response);
        }, err => {
          reject(err);
        });
      });
    })
    .then(response => {
      return new Promise<number> ((resolve, reject)=> {
        console.log(response)
        if (response['success'] == true) {
          this.uid = response['uid']
          localStorage.setItem('session-uid', this.uid.toString());
          this._reset_token(token);
          resolve(this.uid);
        } else {
          this.uid = -1;
          reject('Login failed: ' + response);
        }
      })
    });
    return res;
  }

  async fastLogin(uid: number, token: string) {
    return this.http.post(this.apiUrl + '/fast_login/',
    {
      uid: uid,
      token: token
    }, {})
    .subscribe(_ => {
      console.log('Fast login success');
    }, err => {
      console.log('Fast login failed: ', err);
      throw 'Fast login failed, ' + err.error;
    });
  }

  async signup(signupForm: Signup) {
    console.log(signupForm);
    return new Promise<Boolean> ((resolve, reject) => {
      this.http.post(this.apiUrl + '/signup_api/', signupForm, this.httpOptions)
      .subscribe(response => {
        console.log('signup_api response: ', response);
        if (response['success'] == true) {
          resolve(response['success']);
        } else {
          reject('Signup failed: ' + response['error']);
        }
      }, err => {
        console.log(err);
        reject('Signup post failed: ' + err);
      });
    })
  }

  async getEmail(email: string) {
    console.log(email);
    return new Promise<any> ((resolve, reject) => {
      this.http.get(this.apiUrl + '/email/?email=' + email, {})
      .subscribe(response => {
        resolve(response);
      }, err => {
        reject(err)
      });
    });
  }
  async getProfile() {
    return await new Promise<Profile> (resolve => {
      this.http.get(this.apiUrl + '/users/' + this.uid + '/', this.httpOptions).subscribe(data => {
        resolve(data as Profile);
      }, err => {
        console.log(err);
      });
    });
  }

  async patchProfile(profile: Profile) {
    return await new Promise(resolve => {
      console.log('PATCH with payload: ', profile)
      this.http.patch(this.apiUrl + '/users/' + this.uid + '/', JSON.stringify(profile), this.httpOptions).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async postEnvMeta(envMetaEntity: EnvMetaEntity) {
    return new Promise(resolve => {
      let metadata = new Metadata(this.uid, envMetaEntity);
      this.http.post(this.apiUrl + '/environment/', JSON.stringify(metadata), this.httpOptions)
      .subscribe(data => {
        console.debug('POST env metadata ', data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async postIodoorMeta(iodoorMetaEntity: IodoorMetaEntity) {
    return new Promise(resolve => {
      let metadata = new Metadata(this.uid, iodoorMetaEntity);
      this.http.post(this.apiUrl + '/io-door/', JSON.stringify(metadata), this.httpOptions)
      .subscribe(data => {
        console.debug('POST iodoor metadata ', data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async postStepsMeta(stepsMetaEntity: StepsMetaEntity) {
    return new Promise(resolve => {
      let metadata = new Metadata(this.uid, stepsMetaEntity);
      this.http.post(this.apiUrl + '/steps/', JSON.stringify(metadata), this.httpOptions)
      .subscribe(data => {
        console.debug('POST steps metadata ', data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
