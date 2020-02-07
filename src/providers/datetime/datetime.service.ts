import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class DatetimeService {

  constructor() {

  }

  getDaysAfter(time: number | string | Date, days: number): number | string | Date {
    switch (typeof time) {
      case 'number':
        return time + days * 86400 * 1000;
      case 'string':
        let date = new Date(time);
        date.setTime(date.getTime() + days * 86400000);
        return this.formatDate(date.setHours(0, 0, 0, 0));
      default:
        if (this.isDate(time)) {
          return new Date(time.getTime() + days * 86400000).setHours(0, 0, 0, 0);
        }
        else {
          throw new TypeError('time must be number | string | Date');
        }
    }
  }

  getDaysBefore(time: number | string | Date, days: number): number | string | Date {
    switch (typeof time) {
      case 'number':
        return time - days * 86400 * 1000;
      case 'string':
        let date = new Date(time);
        date.setTime(date.getTime() - days * 86400000);
        return this.formatDate(date.setHours(0, 0, 0, 0));
      default:
        if (this.isDate(time)) {
          return new Date(time.getTime() - days * 86400000).setHours(0, 0, 0, 0);
        }
        else {
          throw new TypeError('time must be number | string | Date');
        }
    }
  }

  timeToDateString(time: number | string | Date): string{
    switch (typeof time) {
      case 'number':
        return this.formatDate(time);
      case 'string':
        return time;
      default:
        if (this.isDate(time)) {
          return this.formatDate(time);
        }
        else {
          throw new TypeError('time must be number | string | Date');
        }
    }
  }

  timeToTimestamp(time: number | string | Date): number{
    switch (typeof time) {
      case 'number':
        return time
      case 'string':
        return new Date(time).getTime();
      default:
        if (this.isDate(time)) {
          return time.getTime();
        }
        else {
          throw new TypeError('time must be number | string | Date');
        }
    }
  }

  private formatDate(time: string | number | Date){
    return formatDate(time, 'yyyy-MM-dd', 'en-US');
  }

  private isDate(object: any): boolean{
    return Object.prototype.toString.call(object) == '[object Date]';
  }

  getDigitalClockTime(timestamp: number) {
    let dayTime = new Date(timestamp)
    return `${dayTime.getHours() <= 12 ? dayTime.getHours() : dayTime.getHours() - 12}:` +
           `${dayTime.getMinutes() < 10 ? '0' + dayTime.getMinutes() : dayTime.getMinutes()} ` +
           `${dayTime.getHours() < 12 ? 'AM' : 'PM'}`;
  }

}
