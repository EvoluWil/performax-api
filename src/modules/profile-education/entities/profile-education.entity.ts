import { EducationLevel, ProfileEducation } from '@prisma/client';

export class ProfileEducationEntity implements ProfileEducation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  profileId: string;
  proof: string;
  level: EducationLevel;
  institution: string;
  course: string;
  endDate: Date;
}
