import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * MetaEntity is used to record metadata with respect to a type of data.
 * The metadata serves the purpose of determining if there is at least one valid data in a specific date.
 * A MetaEntity stored in the repository means there is at least one valid data in the date (primary column).
 * A MetaEntity of a specific date should be deleted if there is no longer valid data in that date.
 */
export abstract class MetaEntity {

    @PrimaryColumn('date')
    dateString: string;

    @Column({
        type: 'integer',
        default: 0
    })
    hasSentData: number;
}

@Entity('iodoorMeta')
export class IodoorMetaEntity extends MetaEntity {

}

@Entity('stepsMeta')
export class StepsMetaEntity extends MetaEntity {

}


@Entity('envMeta')
export class EnvMetaEntity extends MetaEntity {

}
