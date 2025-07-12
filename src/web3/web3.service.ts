import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Identifier } from 'src/entities/identifier.entity';
import generateEthrDID from './utils/ethr-id-generator';
import { encrypt } from './utils/encryption';
import { Credential } from 'src/entities/credential.entity';
import { CreateDidResponse } from './dto/create-did.dto';
import { EthrDID } from 'ethr-did'
import { BusinessCredential, parseVC, VCTypes } from './types/vc.types';
import { createVerifiableCredentialJwt, Issuer, JwtCredentialPayload, verifyCredential } from 'did-jwt-vc';
import { WEB3_STORE, Web3Store } from './storage/web3storage.module';
import { IssueVCDto } from './dto/issue-vc.dto';
import { v4 } from 'uuid';
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
import { CredentialsDto } from './dto/credentials.dto';
import { CreateSalesLogDto } from './dto/create-sales-log.dto';
import { ConfigService } from '@nestjs/config';
import { SalesCredential } from './types/vc.types';
import { CreateBusinessCredentialDto } from './dto/create-business-creds.dto';


export type AliasType = "user" | "org";

@Injectable()
export class Web3Service {
    constructor(
        @InjectRepository(Identifier)
        private readonly identifierRepository : EntityRepository<Identifier>,
        
        @InjectRepository(Credential)
        private readonly credentialRepository: EntityRepository<Credential>,

        @Inject(WEB3_STORE)
        private readonly web3StorageClient: Web3Store,

        private readonly config: ConfigService
    ) {}

    async CreateDid() : Promise<CreateDidResponse> {
        const generated = generateEthrDID();
        const {identifer, provider, privateKey, publicKey} = generated
        
        const newIdentifier = new Identifier();
        newIdentifier.did = identifer.did;
        newIdentifier.provider = provider;
        newIdentifier.privateKey = encrypt(privateKey); 

        await this.identifierRepository.insert(newIdentifier);

        return {
            did: identifer.did,
            publicKey: publicKey,
            privateKey: privateKey
        };
    }

    async IssueVc(dto: IssueVCDto, file? : Express.Multer.File) : Promise<string> {
        const {subjectDid, issuerDid, privateKey, vc, type} = dto;

        const issuerIdentifer = await this.identifierRepository.findOne({did: issuerDid});
        const subjectIdentifier = await this.identifierRepository.findOne({did: subjectDid});

        if(issuerIdentifer === null || subjectIdentifier === null)
            throw new BadRequestException("bad alias request");

        const issuer = new EthrDID({
            identifier: issuerDid,
            privateKey: privateKey,
            rpcUrl: 'https://sepolia.infura.io/v3/' + process.env.INFURA_ID!,
            chainNameOrId: 'sepolia'
        }) as Issuer;

        const now = new Date();
        const types = ['VerifiableCredential', type];
        
        // create credential parse through type
        
        const parcedVc = parseVC(type, JSON.parse(vc));
        parcedVc.vcId = v4();
        parcedVc.date = now.toISOString();
        
        if(file){
            console.log("\n\nuploading file...");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const uint8Array = new Uint8Array(file.buffer);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const blob = new Blob([uint8Array], { type: file.mimetype });
            const uploadedfile = await this.web3StorageClient.uploadFile(blob);
            parcedVc.uploadedFileCid = `https://${uploadedfile.toString()}.ipfs.w3s.link`
            console.log("\n\nfile succesfully uploaded");
        }

        
        const payload: JwtCredentialPayload = {
            sub: subjectDid,
            nbf: Math.floor(now.getTime() / 1000),
            vc: {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type : types,
                credentialSubject: { ...parcedVc }
            }
        }



        const vcJwt: string = await createVerifiableCredentialJwt(payload, issuer);
        const vcFile = new File([vcJwt], `${parcedVc.vcId}.jwt`, { type: 'application/jwt' });
        const uploadedFile = await this.web3StorageClient.uploadFile(vcFile);
        const cid = `https://${uploadedFile.toString()}.ipfs.w3s.link`;
        
        const credential = new Credential();
        credential.vcid = parcedVc.vcId;
        credential.issuer = issuerIdentifer;
        credential.subject = subjectIdentifier;
        credential.timestamp = now;
        credential.type = types;
        
        credential.cid = cid;

        await this.credentialRepository.insert(credential);
     
        return vcJwt;
    }

    async GetCredentials(did: string) : Promise<CredentialsDto[]> {
        const credentials = await this.credentialRepository.find({subject : {
            did: did
        }});

        const parsedCreds: CredentialsDto[] = [];

        const providerConfig = {
            infuraProjectId: process.env.INFURA_ID
        }
        
        const resolver = new Resolver(getResolver(providerConfig))

        for (const c of credentials) {
            const res = await fetch(c.cid);
            const vcJwt = await res.text();

            const verified = await verifyCredential(vcJwt, resolver)
            
            const credentialSub = verified.verifiableCredential.credentialSubject;

            parsedCreds.push({
                type: c.type[1] as VCTypes,
                vc: credentialSub,
                vcJwt: verified.jwt,
                cid: c.cid
            });

        }

        return parsedCreds;
    }

    async CreateSalesLog(dto: CreateSalesLogDto) : Promise<string>{
        const issueVcDto = new IssueVCDto();
        
        const businessCred = await this.credentialRepository.find({
            type: { $like: '%BusinessCredential%' }
        }, {orderBy: {timestamp: 'DESC'}});

        if(businessCred.length === 0 || !businessCred)
            throw new BadRequestException("you need to have a business credential");

        const latestBusinessCred = businessCred[0];

        const {cid} = latestBusinessCred;

        const res = await fetch(cid);
        const vcJwt = await res.text();

        const providerConfig = {
            infuraProjectId: process.env.INFURA_ID
        }
        const resolver = new Resolver(getResolver(providerConfig));
        const verified = await verifyCredential(vcJwt, resolver);


        const verifiedBusinessCreds = verified.verifiableCredential.credentialSubject as BusinessCredential;

        issueVcDto.issuerDid = this.config.get<string>("PLATFORM_DID")!;
        issueVcDto.subjectDid = dto.did;
        issueVcDto.privateKey = this.config.get<string>("PLATFORM_PRIVATE_KEY")!;
        issueVcDto.type = "SalesCredential";
        
        const vcObj = SalesCredential.createThroughReceipt(
            dto.receipt,
            verifiedBusinessCreds.businessName,
            dto.summary
        );
        
        // issue vc
        return await this.IssueVc({...issueVcDto, vc: JSON.stringify(vcObj)});
    }

    async CreateBusinessCredentials(dto: CreateBusinessCredentialDto) {
        const issueVcDto = new IssueVCDto();
        issueVcDto.issuerDid = this.config.get<string>("PLATFORM_DID")!;
        issueVcDto.subjectDid = dto.did;
        issueVcDto.privateKey = this.config.get<string>("PLATFORM_PRIVATE_KEY")!;
        issueVcDto.type = "BusinessCredential";
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { did, ...finalDto} = dto;
        return await this.IssueVc({...issueVcDto, vc: JSON.stringify(finalDto)});
    }
}
