import { VCTypes } from "../types/vc.types";

export class CredentialsDto{
    type: VCTypes;
    vc: any;
    vcJwt: string;
    cid: string;
}



