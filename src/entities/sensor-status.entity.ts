import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity('sensorStatus')
export abstract class SensorStatusEntity {

    @PrimaryColumn("integer")
    dataTimestamp: number;

    @PrimaryColumn("boolean")
    isAvailable: boolean;
}

@Entity('locationStatus')
export class LocationStatusEntity extends SensorStatusEntity{
}

@Entity('pedometerStatus')
export class PedometerStatusEntity extends SensorStatusEntity{
}