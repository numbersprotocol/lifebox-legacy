import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity('weather')
export class WeatherEntity {

    @PrimaryColumn("integer")
    dataTimestamp: number;

    @Column("double")
    tempCelsius: number;

    @Column("double")
    humidity: number;

    @Column("double")
    latitude: number;

    @Column("double")
    longitude: number;
}
