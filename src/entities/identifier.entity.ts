import { Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Credential } from "./credential.entity";
import { TrustScoreCredential } from "./trust-score.entity";

@Entity()
export class Identifier {
    @PrimaryKey()
    did: string;

    @Property()
    provider: string;

    @Property()
    privateKey: string;

    @OneToMany(() => Credential, c => c.issuer)
    subjectCredentials = new Collection<Credential>(this);

    @OneToMany(() => Credential, c => c.subject)
	issuedCredentials =  new Collection<Credential>(this);

    @OneToOne(() => TrustScoreCredential, t => t.identifer)
    trustScore? : TrustScoreCredential
}