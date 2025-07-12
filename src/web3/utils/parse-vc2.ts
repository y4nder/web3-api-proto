// import { plainToInstance } from 'class-transformer';

// class Training {
//   vcId: string;
// }

// class Sales {}

// class Cert {}

// const VCClasses = {
//   training: Training,
//   sales: Sales,
//   cert: Cert,
// };

// type VCConstructors = typeof VCClasses;
// type VCTypes = keyof VCConstructors;

// export function parseVC<K extends VCTypes>(
//   vc: K,
//   payload: unknown
// ): InstanceType<VCConstructors[K]> {
//   const clazz = VCClasses[vc];
//   return plainToInstance(clazz, payload);
// }
