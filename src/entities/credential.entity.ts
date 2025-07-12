import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Identifier } from "./identifier.entity";

@Entity()
export class Credential {
    @PrimaryKey()
    vcid: string;

    @ManyToOne(() => Identifier, { cascade: [Cascade.PERSIST] })
    subject!: Identifier;

    @Property()
    cid: string;

    @Property({type: "json"})
    type: string[]

    @ManyToOne(() => Identifier, {cascade: [Cascade.PERSIST]})
    issuer?: Identifier

    @Property({ onCreate: () => new Date() })
    timestamp!: Date;
}