import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { CreateDidResponse } from './dto/create-did.dto';
import { IssueVCDto } from './dto/issue-vc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBusinessCredentialDto } from './dto/create-business-creds.dto';
import { CreateSalesLogDto } from './dto/create-sales-log.dto';

@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}
  
  @Post("create-did")
  async createDid() : Promise<CreateDidResponse> {
    const response = await this.web3Service.CreateDid();
    return response;
  }

  @Post("issue-vc")
  @UseInterceptors(FileInterceptor('file'))
  async issueVc(@UploadedFile() file: Express.Multer.File, @Body() request: IssueVCDto) {
    if(file){
      console.log('File:', file.originalname);
    }
    const response = await this.web3Service.IssueVc(request, file);
    return response;
  }

  @Get("credentials/:did")
  async getCredentials(@Param('did') did: string) {
    const response = await this.web3Service.GetCredentials(did);
    return response;
  }

  @Post("create-sales-log")
  async createSalesLog(@Body() dto: CreateSalesLogDto) {
    return await this.web3Service.CreateSalesLog(dto);
  }

  @Post("create-business-cred")
  async createBussinessCred(@Body() dto: CreateBusinessCredentialDto) {
    return await this.web3Service.CreateBusinessCredentials(dto);
  }

  @Get("get-trust-score/:did")
  async getTrustScore(@Param("did") did: string){
    return await this.web3Service.GetTrustScore(did);
  }

  @Post("mock")
  Mock() {
    console.log("mocking endpoint");
    this.web3Service.MockIssueThenUpdate();
    console.log("returning dayun");
    return "Mock done na"
  }
}
