import {
  NotificationDomainEnum,
  NotificationTypeEnum,
} from '@prisma/client';

const TITLES: Record<NotificationTypeEnum, string> = {
  [NotificationTypeEnum.TASK_CREATED]: 'Nova OS',
  [NotificationTypeEnum.TASK_ASSIGNED]: 'OS atribuída a você',
  [NotificationTypeEnum.TASK_EXPIRED]: 'OS atrasada',
  [NotificationTypeEnum.TASK_EMERGENCY]: 'OS emergencial',
  [NotificationTypeEnum.TASK_IMPEDED]: 'OS impedida',
  [NotificationTypeEnum.TASK_APPROVED]: 'OS aprovada',
  [NotificationTypeEnum.TASK_REJECTED]: 'OS rejeitada',
  [NotificationTypeEnum.BUDGET_CREATED]: 'Novo orçamento',
  [NotificationTypeEnum.BUDGET_ASSIGNED]: 'Orçamento atribuído a você',
  [NotificationTypeEnum.BUDGET_APPROVED]: 'Orçamento aprovado',
  [NotificationTypeEnum.BUDGET_REJECTED]: 'Orçamento rejeitado',
  [NotificationTypeEnum.OCCURRENCE_CREATED]: 'Nova ocorrência',
  [NotificationTypeEnum.OCCURRENCE_ASSIGNED]: 'Ocorrência atribuída a você',
  [NotificationTypeEnum.OCCURRENCE_APPROVED]: 'Ocorrência aprovada',
  [NotificationTypeEnum.OCCURRENCE_REJECTED]: 'Ocorrência rejeitada',
  [NotificationTypeEnum.FINANCE_CREATED]: 'Novo lançamento',
  [NotificationTypeEnum.FINANCE_ASSIGNED]: 'Lançamento atribuído a você',
  [NotificationTypeEnum.FINANCE_APPROVED]: 'Lançamento aprovado',
  [NotificationTypeEnum.FINANCE_REJECTED]: 'Lançamento rejeitado',
  [NotificationTypeEnum.FINANCE_PAID]: 'Lançamento pago',
};

export function domainOf(type: NotificationTypeEnum): NotificationDomainEnum {
  if (type.startsWith('TASK_')) return NotificationDomainEnum.TASK;
  if (type.startsWith('BUDGET_')) return NotificationDomainEnum.BUDGET;
  if (type.startsWith('OCCURRENCE_')) return NotificationDomainEnum.OCCURRENCE;
  return NotificationDomainEnum.FINANCE;
}

export function notificationCopy(
  type: NotificationTypeEnum,
  protocol?: string | null,
  recordTitle?: string | null,
) {
  const protocolLabel = protocol?.trim();
  const titleLabel = recordTitle?.trim();
  const body =
    protocolLabel && titleLabel
      ? `${protocolLabel} · ${titleLabel}`
      : titleLabel || protocolLabel || 'Registro';

  return { title: TITLES[type], body };
}
