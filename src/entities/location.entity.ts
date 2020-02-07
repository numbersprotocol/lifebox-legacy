import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity('location')
export class LocationEntity {

    @PrimaryColumn("integer")
    dataTimestamp: number;

    @Column("double")
    accuracy: number;

    @Column({
        type: "double",
        nullable: true
    })
    altitude: number;

    @Column({
        type: "double",
        nullable: true
    })
    bearing: number;

    @Column()
    isFromMockProvider: boolean;

    @Column("double")
    latitude: number;

    @Column("integer")
    locationProvider: number;

    @Column("double")
    longitude: number;

    @Column()
    mockLocationsEnabled: boolean;

    @Column("text")
    provider: string;

    @Column({
        type: "double",
        nullable: true
    })
    speed: number;

    isIndoor() {
        let score = 0
        if (this.provider == 'network') {
          score += 1;
        }

        if (this.accuracy > 11) {
          score += 1;
        }
        else if (this.accuracy > 5) {
          score -= 1;
        }
        else {
          score -= 2;
        }
        return score;
    }
}