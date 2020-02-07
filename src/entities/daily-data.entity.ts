import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity('dailyData')
export abstract class DailyDataEntity {

    @PrimaryColumn("text")
    dateString: string;
}

@Entity('sleepActivity')
export class SleepActivityEntity extends DailyDataEntity{
    constructor() {
        super();
        this.wokeupTimestamp = 0;
        this.sleepTimestamp = 0;
        this.sleepDuration = 0;
    }
    @Column({
        type: "integer",
        default: 0
    })
    wokeupTimestamp: number;

    @Column({
        type: "integer",
        default: 0
    })
    sleepTimestamp: number;

    @Column({
        type: "integer",
        default: 0
    })
    sleepDuration: number;

    isValid() {
        return (this.wokeupTimestamp > 0 && this.sleepDuration > 0);
    }

    setWokeupTime(time: number) {
        this.wokeupTimestamp = time;
        if (this.wokeupTimestamp && this.sleepTimestamp) this.updateSleepDuration();
    }

    setSleepTime(time: number) {
        this.sleepTimestamp = time;
        if (this.wokeupTimestamp && this.sleepTimestamp) this.updateSleepDuration();
    }

    updateSleepDuration() {
        this.sleepDuration = (this.wokeupTimestamp - this.sleepTimestamp) / (1000 * 60* 60);
    }
}

@Entity('iodoorData')
export class IodoorDataEntity extends DailyDataEntity{
    constructor() {
        super();
        this.indoorTime = 0;
        this.outdoorTime = 0;
        this.indoorPercent = 0;
        this.outdoorPercent = 0;
    }
    @Column({
        type: "integer",
        default: "0"
    })
    indoorTime: number;

    @Column({
        type: "integer",
        default: "0"
    })
    outdoorTime: number;

    @Column({
        type: "double",
        default: "0"
    })
    indoorPercent: number;

    @Column({
        type: "double",
        default: "0"
    })
    outdoorPercent: number;

    addIndoorTime(time: number) {
        this.indoorTime += time;
        this.updateIodoorPercent();
    }

    addOutdoorTime(time: number) {
        this.outdoorTime += time;
        this.updateIodoorPercent();
    }

    isValid() {
        return (this.indoorPercent > 0 || this.outdoorPercent > 0);
    }

    resetTime() {
        this.indoorTime = 0;
        this.outdoorTime = 0;
        this.indoorPercent = 0;
        this.outdoorPercent = 0;
    }

    updateIodoorPercent() {
        if (this.indoorTime != 0 || this.outdoorTime != 0) {
            let totalTime = this.indoorTime + this.outdoorTime;
            this.indoorPercent = Math.round(this.indoorTime / totalTime * 1000) / 10;
            this.outdoorPercent = Math.round(this.outdoorTime / totalTime * 1000) / 10;
          } 
    }
}

@Entity('stepsData')
export class StepsDataEntity extends DailyDataEntity{
    constructor() {
        super();
        this.steps = 0;
    }
    @Column({
        type: "integer",
        default: 0
    })
    steps: number;

    addSteps(steps: number) {
        this.steps += steps;
    }
}