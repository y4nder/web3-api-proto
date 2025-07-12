import { Wallet } from "ethers";
import { EthrDID } from "ethr-did";

export default function generateEthrDID() : {
    identifer: EthrDID, provider: string, privateKey: string, publicKey: string
} {
    const userWallet = Wallet.createRandom();
    const privateKey = userWallet.privateKey.slice(2);
    const publicKey = userWallet.publicKey;
    const provider = 'sepolia';

    const userDid = new EthrDID({
        identifier: userWallet.address,
        privateKey,
        rpcUrl : 'https://sepolia.infura.io/v3/' + process.env.INFURA_ID!,
        chainNameOrId: provider
    });

    return {
        identifer: userDid,
        provider: provider,
        privateKey: privateKey,
        publicKey: publicKey
    };
}