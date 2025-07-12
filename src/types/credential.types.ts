interface BaseCredential {
    id: string;
}

export interface TrainingCredential extends BaseCredential {
    name: string;
    training: string;
    date: string;
}

export interface ProfileCredential extends BaseCredential {
    name: string;
    email: string;
}