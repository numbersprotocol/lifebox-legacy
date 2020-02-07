import { Injectable } from '@angular/core';

@Injectable()
export class VisualizationUtility {

  constructor() {
    console.log('Hello NumbersDataVisualizationUtility Provider');
  }

  getWeekday(date_obj){
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    return weekdays[date_obj.getDay()];
  }

  getWeekdayShort(date_obj){
    var weekdays = new Array(7);
    weekdays[0] = "Sun";
    weekdays[1] = "Mon";
    weekdays[2] = "Tue";
    weekdays[3] = "Wed";
    weekdays[4] = "Thu";
    weekdays[5] = "Fri";
    weekdays[6] = "Sat";
    return weekdays[date_obj.getDay()];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JournalVisualizationPage');
  }

}
