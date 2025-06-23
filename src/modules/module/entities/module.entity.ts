import { Module } from '@prisma/client';

export class ModuleEntity implements Module {
  id: string;
  name: string;
  code: string;
  description: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
