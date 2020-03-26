import { Injectable } from '@angular/core';
import {EventEmitter} from 'eventemitter3';
@Injectable({
  providedIn: 'root'
})
export class BloodstoreService {

  public Bloodstore: any;
  constructor() { 
    this.Bloodstore=new EventEmitter();  //这个实例就会被多个组件共享，来实现不同页面的数据通信
  }
}

