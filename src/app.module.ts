import { Module } from '@nestjs/common';
import { Web3Module } from './web3/web3.module';
import config from "./mikro-orm.config";
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Web3StorageModule } from './web3/storage/web3storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    Web3Module,
    MikroOrmModule.forRootAsync({
        useFactory: () => config
    }),
    Web3StorageModule,
    ConfigModule.forRoot({isGlobal: true}),
    
  ]
})
export class AppModule {}
