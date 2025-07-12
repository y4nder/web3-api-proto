import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Client } from "@web3-storage/w3up-client";

export const WEB3_STORE = Symbol("web3-store");

export type Web3Store = Client;

@Module({
    imports: [ConfigModule],
    providers: [{
        provide: WEB3_STORE,
        inject: [ConfigService],
        useFactory : async (config: ConfigService) : Promise<Web3Store> => {
            const { create } = await import('@web3-storage/w3up-client'); 
            const web3StorageClient= await create()
            const email = config.get<`${string}@${string}`>("WEB3_STORAGE_EMAIL")!;

            if (!Object.keys(web3StorageClient.accounts()).length) {
            console.log('Logging to your Web3.storage Account...')
            console.log('Waiting for your email confirmation...')
            await web3StorageClient.login(email)
            console.log('Client successfully linked to your account...')
            const spaces = web3StorageClient.spaces()
            if (spaces.length) {
                await web3StorageClient.setCurrentSpace(spaces[0].did())
                console.log('Space provided!')
            }
            } else { 
                const spaces = web3StorageClient.spaces()
                if (spaces.length) {
                    await web3StorageClient.setCurrentSpace(spaces[0].did())
                }
            }

            return web3StorageClient;
        }
    }],
    exports: [WEB3_STORE]
})
export class Web3StorageModule{}