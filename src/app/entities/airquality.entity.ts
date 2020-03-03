import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('airquality')
export class AirQualityEntity {

    @PrimaryColumn('integer')
    dataTimestamp: number;

    @Column('double')
    aqi: number;
}
