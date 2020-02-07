import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity('config')
export class ConfigEntity {
    constructor(){
        this.id = 0;
        this.locationSensor = false;
        this.pedometerSensor = false;
        this.gyroscopeSensor = false;
    }

    @PrimaryColumn({
        type: "integer",
        default: 0
    })
    id: number;

    @Column({
        default: "0"
    })
    locationSensor: boolean;

    @Column({
        default: "0"
    })
    pedometerSensor: boolean;

    @Column({
        default: "0"
    })
    gyroscopeSensor: boolean;
    
}