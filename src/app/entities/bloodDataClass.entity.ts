import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CustomClassRecordEntity } from './customClassRecord.entity';

// @Entity('customClass')
@Entity('bloodDataClass')
export class BloodDataClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true
  })
  name: string;

  @Column('double')

  weight: number;
  @Column('double')

  height: number;
  @Column('double')

  urine: number;
  @Column('double')

  sugar: number;
  @Column('double')

  heartbeat: number;
  @Column('double')

  diastolic: number;
  @Column('double')

  systolic: number;



  @Column('double')
  max: number;

  @Column('double')
  min: number;

  @Column({
    type: 'double',
    nullable: true
  })
  interval: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true
  })
  unit: string;

  @Column({
    type: 'varchar',
    default: 'settings'
  })
  icon: string;

  @OneToMany(type => CustomClassRecordEntity, customClassRecordEntity => customClassRecordEntity.class)
  records: CustomClassRecordEntity[];
}
