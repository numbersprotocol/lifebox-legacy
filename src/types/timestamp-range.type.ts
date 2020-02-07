import { formatDate } from "@angular/common";

export class TimestampRange {

    constructor(public startTimestamp: number = 0, public endTimestamp: number = 0){

    }

    setAsOneDay(date: Date) {
        this.startTimestamp = date.setHours(0, 0, 0, 0);
        this.endTimestamp = date.setHours(23, 59, 59, 999);
    }

    setStart(timestamp: number) {
        this.startTimestamp = timestamp;
    }

    setEnd(timestamp: number) {
        this.endTimestamp = timestamp;
    }

    getDuration() {
        return this.endTimestamp - this.startTimestamp;
    }

    debug() {
        console.log('Start datetime: ', formatDate(this.startTimestamp, 'full', 'en-US'));
        console.log('End datetime: ', formatDate(this.endTimestamp, 'full', 'en-US'));
    }
}