import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('log')
export class LogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('integer')
    dataTimestamp: number;

    @Column('text')
    timeString: string;

    @Column('text')
    level: string;

    @Column('text')
    title: string;

    @Column('text')
    message: string;
}
