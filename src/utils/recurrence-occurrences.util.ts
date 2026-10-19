import type { Options } from 'rrule';

export type ExpandRecurrenceOptions = {
  /** Inclusive upper bound (e.g. master endDate). */
  endDate?: Date | null;
  /** Max occurrences when there is no endDate or count in the rule. */
  max?: number;
};

function daysInMonthUtc(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function buildOccurrenceUtc(
  year: number,
  monthIndex: number,
  day: number,
  template: Date,
): Date {
  return new Date(
    Date.UTC(
      year,
      monthIndex,
      day,
      template.getUTCHours(),
      template.getUTCMinutes(),
      template.getUTCSeconds(),
      template.getUTCMilliseconds(),
    ),
  );
}

function resolveAnchorDay(options: Options, dtstart: Date): number {
  if (options.bymonthday !== undefined && options.bymonthday !== null) {
    const raw = Array.isArray(options.bymonthday)
      ? options.bymonthday[0]
      : options.bymonthday;
    if (typeof raw === 'number') return raw;
  }
  return dtstart.getUTCDate();
}

/** Monthly (and monthly-interval) rules anchored on a calendar day, without weekday/setpos. */
export function isClampedCalendarMonthly(options: Options, freqMonthly: number): boolean {
  if (options.freq !== freqMonthly) return false;
  if (options.byweekday) return false;
  if (options.bysetpos !== undefined && options.bysetpos !== null) return false;
  return true;
}

/**
 * One occurrence per interval-month on anchorDay, or last day of month when shorter
 * (e.g. day 31 → Apr 30; day 30 → Feb 28/29).
 */
export function expandMonthlyClamped(params: {
  dtstart: Date;
  anchorDay: number;
  interval: number;
  count?: number | null;
  until?: Date | null;
  endDate?: Date | null;
  max: number;
}): Date[] {
  const { dtstart, anchorDay, interval } = params;
  const hardLimit = params.count ?? params.max;
  const occurrences: Date[] = [];

  let y = dtstart.getUTCFullYear();
  let m = dtstart.getUTCMonth();

  while (occurrences.length < hardLimit) {
    const day = Math.min(anchorDay, daysInMonthUtc(y, m));
    const occ = buildOccurrenceUtc(y, m, day, dtstart);

    if (occ.getTime() >= dtstart.getTime()) {
      if (params.until && occ.getTime() > params.until.getTime()) break;
      if (params.endDate && occ.getTime() > params.endDate.getTime()) break;
      occurrences.push(occ);
    }

    m += interval;
    while (m > 11) {
      m -= 12;
      y += 1;
    }
  }

  return occurrences;
}

export async function expandRecurrenceOccurrences(
  recurrence: string,
  fallbackStart: Date,
  bounds: ExpandRecurrenceOptions,
): Promise<Date[]> {
  const { RRule } = await import('rrule');
  const freqMonthly = RRule.MONTHLY;

  let rule: InstanceType<typeof RRule>;
  try {
    rule = RRule.fromString(recurrence);
  } catch {
    return [];
  }

  const options = rule.origOptions as Options;
  const dtstart = (options.dtstart as Date | undefined) ?? fallbackStart;
  const interval = options.interval ?? 1;
  const count = options.count ?? null;
  const until = (options.until as Date | undefined) ?? null;
  const max = bounds.max ?? 100;

  if (isClampedCalendarMonthly(options, freqMonthly)) {
    return expandMonthlyClamped({
      dtstart,
      anchorDay: resolveAnchorDay(options, dtstart),
      interval,
      count,
      until,
      endDate: bounds.endDate,
      max,
    });
  }

  if (bounds.endDate) {
    return rule.between(fallbackStart, bounds.endDate, true) as Date[];
  }

  const cap = count ?? max;
  return rule.all((_, len) => len < cap) as Date[];
}
