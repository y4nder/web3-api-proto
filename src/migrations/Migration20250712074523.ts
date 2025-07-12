import { Migration } from '@mikro-orm/migrations';

export class Migration20250712074523 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`trust_score_credential\` (\`id\` text not null, \`score\` integer not null, \`summary\` text not null, \`factors\` json not null, \`identifer_did\` text not null, constraint \`trust_score_credential_identifer_did_foreign\` foreign key(\`identifer_did\`) references \`identifier\`(\`did\`) on update cascade, primary key (\`id\`));`);
    this.addSql(`create unique index \`trust_score_credential_identifer_did_unique\` on \`trust_score_credential\` (\`identifer_did\`);`);
  }

}
