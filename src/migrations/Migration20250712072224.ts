import { Migration } from '@mikro-orm/migrations';

export class Migration20250712072224 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`identifier\` (\`did\` text not null, \`provider\` text not null, \`private_key\` text not null, primary key (\`did\`));`);

    this.addSql(`create table \`credential\` (\`vcid\` text not null, \`subject_did\` text not null, \`cid\` text not null, \`type\` json not null, \`issuer_did\` text not null, \`timestamp\` datetime not null, constraint \`credential_subject_did_foreign\` foreign key(\`subject_did\`) references \`identifier\`(\`did\`) on update cascade, constraint \`credential_issuer_did_foreign\` foreign key(\`issuer_did\`) references \`identifier\`(\`did\`) on update cascade, primary key (\`vcid\`));`);
    this.addSql(`create index \`credential_subject_did_index\` on \`credential\` (\`subject_did\`);`);
    this.addSql(`create index \`credential_issuer_did_index\` on \`credential\` (\`issuer_did\`);`);
  }

}
