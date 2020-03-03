import { Injectable } from '@angular/core';

import { DataService } from '../data/data.service';
import { RestService } from '../rest/rest.service';
import { EnvMetaEntity, IodoorMetaEntity, StepsMetaEntity, MetaEntity } from '../../entities/metadata.entity';
import { RepoService } from '../repo/repo.service';

import { Metadata } from '../../models/metadata.model';

@Injectable({
  providedIn: 'root'
})
export class CommService {
  uid: string;

  constructor(
    public dataService: DataService,
    public restService: RestService,
    private repoService: RepoService
  ) {
    this.uid = localStorage.getItem('session-uid');
  }

  async sendEnvMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) { date = new Date(); }
      this.dataService.getUnsentEnvMeta()
        .then((dataList: Array<EnvMetaEntity>) => {
          for (const data of dataList) {
            this.restService.postEnvMeta(this.createMetaData(data))
              .then((res) => {
                data.hasSentData = 1;
                this.repoService.saveEnvMeta(data)
                  .catch(e => console.log(e));
              })
              .catch(e => console.log(e));
          }
          resolve();
        }).catch(e => reject(e));
    });
  }

  async sendIodoorMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) { date = new Date(); }
      this.dataService.getUnsentIodoorMeta()
        .then((dataList: Array<IodoorMetaEntity>) => {
          for (const data of dataList) {
            this.restService.postIodoorMeta(this.createMetaData(data))
              .then((res) => {
                data.hasSentData = 1;
                this.repoService.saveIodoorMeta(data)
                  .catch(e => console.log(e));
              })
              .catch(e => console.log(e));
          }
          resolve();
        }).catch(e => reject(e));
    });
  }

  async sendStepsMeta(date: Date = null) {
    return new Promise((resolve, reject) => {
      if (!date) { date = new Date(); }
      this.dataService.getUnsentStepsMeta()
        .then((dataList: Array<StepsMetaEntity>) => {
          for (const data of dataList) {
            this.restService.postStepsMeta(this.createMetaData(data))
              .then((res) => {
                data.hasSentData = 1;
                this.repoService.saveStepsMeta(data)
                  .catch(e => console.log(e));
              })
              .catch(e => console.log(e));
          }
          resolve();
        }).catch(e => reject(e));
    });
  }

  private createMetaData(metaEntity: MetaEntity) {
    const metadata: Metadata = {
      date: metaEntity.dateString,
      user: +this.uid,
      hasValidData: true,
    };
    return metadata;
  }

}
