import {Entity, Column, ManyToOne, Double, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm"
import {CustomClassEntity} from "./customClass.entity"

@Entity('customClassRecord')
export class CustomClassRecordEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("integer")
    dateTimeStamp: number;

    @Column({
        type: "double",
        nullable: true
    })
    value: number;

    @ManyToOne(type => CustomClassEntity, customClassEntity => customClassEntity.records)
    class: CustomClassEntity;
}