import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity('pedometer')
export class PedometerEntity {

    @PrimaryColumn("integer")
    dataTimestamp: number;

    @Column("integer")
    startDate: number;

    @Column("integer")
    endDate: number;

    @Column("integer")
    numberOfSteps: number;
}