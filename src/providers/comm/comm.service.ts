import { Injectable } from '@angular/core';

import { DataService } from '../data/data.service'
import { RestService } from '../rest/rest.service'

import { EnvMetaEntity, IodoorMetaEntity, StepsMetaEntity } from '../../entities/metadata.entity';

@Injectable()
export class CommService {

  constructor(public dataService: DataService,
              public restService: RestService) {
  }

  async sendEnvMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      this.dataService.getUnsentEnvMeta()
      .then((data: Array<EnvMetaEntity>) => {
        for (let i = 0; i < data.length; i++) {
          this.restService.postEnvMeta(data[i])
          .then((res) => {
            data[i].hasSentData = 1;
            this.dataService.saveEnvMeta(data[i])
            .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
        }
        resolve();
      }).catch(e => reject(e));
    })
  }

  async sendIodoorMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      this.dataService.getUnsentIodoorMeta()
      .then((data: Array<IodoorMetaEntity>) => {
        for (let i = 0; i < data.length; i++) {
          this.restService.postIodoorMeta(data[i])
          .then((res) => {
            data[i].hasSentData = 1;
            this.dataService.saveIodoorMeta(data[i])
            .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
        }
        resolve();
      }).catch(e => reject(e));
    })
  }

  async sendStepsMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) date = new Date();
      this.dataService.getUnsentStepsMeta()
      .then((data: Array<StepsMetaEntity>) => {
        for (let i = 0; i < data.length; i++) {
          this.restService.postStepsMeta(data[i])
            .then((res) => {
              data[i].hasSentData = 1;
              this.dataService.saveStepsMeta(data[i])
              .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        }
        resolve();
      }).catch(e => reject(e));
    })
  }



}
