import { VCTypes } from "../types/vc.types";

export class IssueVCDto {
    issuerDid: string;
    subjectDid: string;
    privateKey: string;
    type: VCTypes;
    vc: string;
}
