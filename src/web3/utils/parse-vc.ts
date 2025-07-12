// import { plainToInstance } from 'class-transformer';


// type VCTypeMap = {
//   training: Training,
//   sales: Sales,
//   cert: Cert,
// }

// type VCTypes = keyof VCTypeMap;

// const VCParsers = { 
//   training: genericParser(Training),
//   sales: genericParser(Sales),
//   cert: genericParser(Cert),
// } satisfies {
//   [K in VCTypes]: (data: unknown) => VCTypeMap[K]
// }

// function genericParser<T>(cls: new () => T): (data: unknown) => T {
//   return (data: unknown) => plainToInstance(cls, data);
// }


// export function parseVC<K extends VCTypes>(
//   vc: K,
//   payload: unknown
// ): VCTypeMap[K] {
//   return VCParsers[vc](payload) as VCTypeMap[K];
// }


