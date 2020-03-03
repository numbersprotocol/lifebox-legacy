import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('config')
export class ConfigEntity {
    constructor() {
        this.id = 0;
        this.locationSensor = false;
        this.pedometerSensor = false;
        this.gyroscopeSensor = false;
    }

    @PrimaryColumn({
        type: 'integer',
        default: 0
    })
    id: number;

    @Column({
        default: false
    })
    locationSensor: boolean;

    @Column({
        default: false
    })
    pedometerSensor: boolean;

    @Column({
        default: false
    })
    gyroscopeSensor: boolean;

    @Column({
        default: 'en'
    })
    language: string;

}
