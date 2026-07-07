export const MODULE_DEFINITIONS = [
  {
    code: 'task',
    name: 'Ordens de Serviço',
    description: 'Gestão de ordens de serviço e atendimento',
  },
  {
    code: 'budget',
    name: 'Orçamentos',
    description: 'Gestão de orçamentos',
  },
  {
    code: 'occurrence',
    name: 'Ocorrências',
    description: 'Gestão de ocorrências',
  },
  {
    code: 'financial',
    name: 'Financeiro',
    description: 'Lançamentos financeiros, adiantamentos e cadastros financeiros',
  },
  {
    code: 'client',
    name: 'Clientes',
    description: 'Gestão de clientes',
  },
  {
    code: 'contract',
    name: 'Contratos',
    description: 'Gestão de contratos e tipos de contrato',
  },
  {
    code: 'employee',
    name: 'Funcionários',
    description: 'Gestão de funcionários',
  },
  {
    code: 'user',
    name: 'Usuários',
    description: 'Gestão de usuários da empresa',
  },
  {
    code: 'role',
    name: 'Cargos',
    description: 'Gestão de cargos e permissões',
  },
  {
    code: 'register',
    name: 'Cadastros',
    description: 'Tipos de OS, orçamento e ocorrência',
  },
  {
    code: 'whitelabel',
    name: 'White Label',
    description: 'Personalização visual da empresa',
  },
] as const;

export type ModuleCode = (typeof MODULE_DEFINITIONS)[number]['code'];

export const MODULE_CODES = MODULE_DEFINITIONS.map((m) => m.code);
