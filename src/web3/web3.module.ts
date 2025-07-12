import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { Web3Controller } from './web3.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { entities } from 'src/entities';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Web3StorageModule } from './storage/web3storage.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([...entities]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
    Web3StorageModule
  ],
  controllers: [Web3Controller],
  providers: [Web3Service],
})
export class Web3Module {}
