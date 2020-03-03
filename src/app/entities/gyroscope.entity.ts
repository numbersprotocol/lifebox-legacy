import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('gyroscope')
export class GyroscopeEntity {

    @PrimaryColumn('integer')
    dataTimestamp: number;

    @Column('integer')
    x: number;

    @Column('integer')
    y: number;

    @Column('integer')
    z: number;
}
