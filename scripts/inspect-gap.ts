import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ids = ['69f2b71f3d5c11654f22ea5e', '69f3fe612dd331132ebb2456'];

async function main() {
  const { RRule } = await import('rrule');

  for (const id of ids) {
    const r = await prisma.companyFinanceRecurring.findUnique({ where: { id } });
    if (!r) continue;

    const all = await prisma.companyFinance.findMany({
      where: { recurrenceMasterId: id },
      select: { date: true, deleted: true, title: true },
      orderBy: { date: 'asc' },
    });
    const active = all.filter((f) => !f.deleted);

    const rule = RRule.fromString(r.recurrence!);
    const expected = rule.all((_, len) => len < 100) as Date[];
    const activeTimes = new Set(active.map((f) => f.date.getTime()));
    const allTimes = new Set(all.map((f) => f.date.getTime()));
    const missingActive = expected.filter((d) => !activeTimes.has(d.getTime()));
    const missingAll = expected.filter((d) => !allTimes.has(d.getTime()));

    console.log('---', r.title);
    console.log('active:', active.length, 'all:', all.length, 'expected:', expected.length);
    console.log('missing (active):', missingActive.map((d) => d.toISOString()));
    console.log('missing (incl deleted):', missingAll.map((d) => d.toISOString()));

    const deleted = all.filter((f) => f.deleted);
    if (deleted.length) {
      console.log('deleted entries:', deleted.map((f) => f.date.toISOString()));
    }
  }
}

main().finally(() => prisma.$disconnect());
