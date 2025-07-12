import { ReceiptMetadata } from "../types/vc.types";

export class CreateSalesLogDto {
    did: string;
    receipt: ReceiptMetadata;
    summary: string;
}