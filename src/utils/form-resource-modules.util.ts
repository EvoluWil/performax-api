import { ResourceKey } from 'src/modules/company/form-resources/dto/form-resources.dto';

export const FORM_RESOURCE_MODULE_MAP: Record<ResourceKey, string> = {
  clients: 'client',
  users: 'user',
  employees: 'employee',
  financeTypes: 'financial',
  financeBanks: 'financial',
  financeCategories: 'financial',
  financeSegments: 'financial',
  financePayees: 'financial',
  financePaymentMethods: 'financial',
  taskTypes: 'register',
  budgetTypes: 'register',
  occurrenceTypes: 'register',
  contractTypes: 'register',
};
