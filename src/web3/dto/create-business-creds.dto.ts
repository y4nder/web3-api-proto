export class CreateBusinessCredentialDto {
    did: string;
    businessOwner: string;
    businessName : string;
    businessType : string;
    location: {
        long: number,
        lat: number,
        address: string
    };
}