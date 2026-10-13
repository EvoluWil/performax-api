import {
  endOfDay,
  endOfMonth,
  getDate,
  isValid,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';

export type DashboardWindow = {
  month: string;
  from: Date;
  to: Date;
  previousFrom: Date;
  previousTo: Date;
  complete: boolean;
  forecastTo: Date;
};

export class DashboardWindowError extends Error {
  constructor(readonly code: 'INVALID_MONTH' | 'FUTURE_MONTH') {
    super(code);
  }
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function resolveDashboardWindow(
  month: string | undefined,
  now = new Date(),
): DashboardWindow {
  const currentMonthStart = startOfMonth(now);
  let selected = currentMonthStart;

  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new DashboardWindowError('INVALID_MONTH');
    }

    const [yearText, monthText] = month.split('-');
    const year = Number(yearText);
    const monthIndex = Number(monthText) - 1;
    selected = new Date(year, monthIndex, 1);

    if (!isValid(selected) || selected.getMonth() !== monthIndex) {
      throw new DashboardWindowError('INVALID_MONTH');
    }
  }

  if (selected.getTime() > currentMonthStart.getTime()) {
    throw new DashboardWindowError('FUTURE_MONTH');
  }

  const complete = selected.getTime() < currentMonthStart.getTime();
  const from = startOfMonth(selected);
  const forecastTo = endOfMonth(selected);
  const to = complete ? forecastTo : endOfDay(now);
  const previousFrom = startOfMonth(subMonths(from, 1));

  let previousTo: Date;
  if (complete) {
    previousTo = endOfMonth(previousFrom);
  } else {
    const previousMonthEnd = endOfMonth(previousFrom);
    const day = Math.min(getDate(now), getDate(previousMonthEnd));
    previousTo = endOfDay(new Date(
      previousFrom.getFullYear(),
      previousFrom.getMonth(),
      day,
    ));
  }

  return {
    month: monthKey(from),
    from,
    to,
    previousFrom,
    previousTo,
    complete,
    forecastTo,
  };
}

const SHORT_MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

const FULL_MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function daySpan(from: Date, to: Date, withYear: boolean) {
  const text = `${pad(from.getDate())}–${pad(to.getDate())}/${SHORT_MONTHS[from.getMonth()]}`;
  return withYear ? `${text}/${from.getFullYear()}` : text;
}

export function formatDashboardWindowLabel(window: DashboardWindow) {
  if (window.complete) {
    const current = `${FULL_MONTHS[window.from.getMonth()]}/${window.from.getFullYear()}`;
    const previous = `${FULL_MONTHS[window.previousFrom.getMonth()]}/${window.previousFrom.getFullYear()}`;
    return `${current} × ${previous}`;
  }

  const withYear = window.from.getFullYear() !== window.previousFrom.getFullYear();
  return `${daySpan(window.from, window.to, withYear)} × ${daySpan(window.previousFrom, window.previousTo, withYear)}`;
}

export function startOfToday(now = new Date()) {
  return startOfDay(now);
}
