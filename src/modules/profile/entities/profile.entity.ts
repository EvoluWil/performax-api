import {
  BiologicalGenderEnum,
  EthnicityEnum,
  GenderEnum,
  MaritalStatusEnum,
  Profile,
} from '@prisma/client';

export class ProfileEntity implements Profile {
  id: string;
  nationality: string;
  homeState: string;
  homeCity: string;
  socialName: string;
  birthdate: Date;
  matherName: string;
  fatherName: string;
  gender: GenderEnum;
  ethnicity: EthnicityEnum;
  maritalStatus: MaritalStatusEnum;
  biologicalGender: BiologicalGenderEnum;
  createdAt: Date;
  updatedAt: Date;
  isPwd: boolean;
}
