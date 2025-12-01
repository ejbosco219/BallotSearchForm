export interface VoterAddress {
  city: string;
  country?: string;
  county?: string;
  state: string;
  street: string;
  streetNumber: string;
  unit?: string;
  zipCode: string;
}

export interface VoterSignatureKey {
  identityId: string;
  rowImageKey: string;
}

export interface VoterSignatureProjectInfo {
  coordinator?: string;
  identityId?: string;
  petitioner: string;
  project: string;
  reviewed: boolean;
  turnIn: string;
}

export interface VoterSignature {
  _id: string;
  createdAt: string;
  key: VoterSignatureKey;
  projectInfo: VoterSignatureProjectInfo;
  signedDate?: string;
}

export interface Voter {
  _id: string;
  address: VoterAddress;
  compositeKey?: string;
  county?: string;
  createdAt?: string;
  dateOfBirth?: string;
  firstName: string;
  importBatch?: string;
  lastName: string;
  middleName?: string;
  name?: string;
  partyAffiliation?: string;
  processedAt?: string;
  signatures?: VoterSignature[];
  title?: string;
  updatedAt?: string;
  voterId: string;
  voterStatus?: string;
}
