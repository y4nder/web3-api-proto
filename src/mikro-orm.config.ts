import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { entities } from './entities';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
    driver: SqliteDriver,
    entities: [...entities],
    dbName: 'db.sqlite3',
    extensions: [Migrator, SeedManager]
})