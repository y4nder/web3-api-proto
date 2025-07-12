import { plainToInstance } from 'class-transformer';


class BaseVC {
    vcId: string;
    date: string;
    uploadedFileCid?: string;
}

export interface ReceiptMetadata {
	totalAmount: number;
	totalConfidence: number;
	date: string;
	dateConfidence: number;
	merchantName?: string;
	merchantConfidence?: number;

	// Optional extra checks
	taxAmount?: number;
	currency?: string;
	lineItems?: {
		name: string;
		quantity?: number;
		unitPrice?: number;
		totalPrice?: number;
	}[];
}


// Extend classes here ------------------------------------------

export class BusinessCredential extends BaseVC {
    businessOwner: string;
    businessName : string;
    businessType : string;
    location: {
        long: number,
        lat: number,
        address: string
    };
}

export class TrainingCredential extends BaseVC {
    name: string;           // participant's name
    training: string;       // e.g. "Digital Marketing 101"
    provider: string;       // organization name or alias
    hoursCompleted: number; // e.g. 3
    location?: string;      // optional: where the class was held
}

export class SalesCredential extends BaseVC {
    businessName: string;     // e.g. "Aling Nena's Sari-Sari Store"
    productSold: string;      // e.g. "Softdrinks"
    quantity: number;         // e.g. 20
    totalSales: number;       // e.g. 600
    currency: string;         // e.g. "PHP"
    salesSummary: string;
    receipt?: ReceiptMetadata;

    static createThroughReceipt(
        receipt: ReceiptMetadata,
        businessName: string,
        summary: string,
    ) {
        return {
            businessName: businessName,
            productSold: receipt.lineItems!.map(i => i.name).toString(),
            quantity: receipt.lineItems!.reduce((sum, i) => sum + (i.quantity ?? 0), 0),
            totalSales: receipt.totalAmount,       
            currency: receipt.currency ? receipt.currency : "unknown",        
            salesSummary: summary,
            receipt: receipt
        }
    }
}

export class CertificateCredential extends BaseVC {
    recipientName: string;     // person's full name
    title: string;             // e.g. "Certificate of Completion"
    issuedBy: string;          // e.g. DTI or TESDA
    description: string;       // short summary of the certificate
}




// ------------------------------------------

type VCTypeMap = {
  TrainingCredential: TrainingCredential,
  SalesCredential: SalesCredential,
  CertificateCredential: CertificateCredential,
  BusinessCredential: BusinessCredential
}

// ------------------------------------------------------

export type VCTypes = keyof VCTypeMap;

const VCParsers = { 
  TrainingCredential: genericParser(TrainingCredential),
  SalesCredential: genericParser(SalesCredential),
  CertificateCredential: genericParser(CertificateCredential),
  BusinessCredential: genericParser(BusinessCredential)
} satisfies {
  [K in VCTypes]: (data: unknown) => VCTypeMap[K]
}

function genericParser<T>(cls: new () => T): (data: unknown) => T {
  return (data: unknown) => plainToInstance(cls, data);
}


export function parseVC<K extends VCTypes>(
  vc: K,
  payload: unknown
): VCTypeMap[K] {
  return VCParsers[vc](payload) as VCTypeMap[K];
}


