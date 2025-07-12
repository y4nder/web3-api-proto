/* eslint-disable @typescript-eslint/require-await */
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Identifier } from '../entities/identifier.entity';
import "dotenv/config";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log("Running Seeder")
    
    const platformIdentifier = em.create(Identifier, {
      did: process.env.PLATFORM_DID!,
      provider: 'sepolia',
      privateKey: process.env.PLATFORM_PRIVATE_KEY!,
    });

    console.log('Seeded with platform identifier', platformIdentifier);
  }
}
