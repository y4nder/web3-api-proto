import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Identifier } from "./identifier.entity";
import { v4 } from "uuid";

@Entity()
export class TrustScoreCredential {
    @PrimaryKey()
    id = v4()

    @Property()
    score: number;

    @Property()
    summary: string;

    @Property({type: "json"})
    factors: string[]

    @OneToOne(() => Identifier, i => i.trustScore, {owner: true})
    identifer!: Identifier
}