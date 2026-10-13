import * as assert from 'node:assert/strict';
import { formatDashboardWindowLabel, resolveDashboardWindow } from './dashboard.window';

function main() {
  const open = resolveDashboardWindow('2026-10', new Date(2026, 9, 13, 15, 0, 0));
  assert.equal(open.complete, false);
  assert.equal(open.from.getTime(), new Date(2026, 9, 1, 0, 0, 0, 0).getTime());
  assert.equal(open.to.getDate(), 13);
  assert.equal(open.to.getMonth(), 9);
  assert.equal(open.previousFrom.getMonth(), 8);
  assert.equal(open.previousTo.getDate(), 13);
  assert.equal(open.previousTo.getMonth(), 8);
  assert.equal(open.forecastTo.getDate(), 31);

  const closed = resolveDashboardWindow('2026-09', new Date(2026, 9, 13, 15, 0, 0));
  assert.equal(closed.complete, true);
  assert.equal(closed.from.getMonth(), 8);
  assert.equal(closed.to.getDate(), 30);
  assert.equal(closed.previousFrom.getMonth(), 7);
  assert.equal(closed.previousTo.getDate(), 31);

  const march = resolveDashboardWindow(undefined, new Date(2026, 2, 31, 8, 0, 0));
  assert.equal(march.month, '2026-03');
  assert.equal(march.previousTo.getMonth(), 1);
  assert.equal(march.previousTo.getDate(), 28);

  assert.throws(
    () => resolveDashboardWindow('2026-11', new Date(2026, 9, 13)),
    /FUTURE_MONTH/,
  );
  assert.throws(
    () => resolveDashboardWindow('2026-13', new Date(2026, 9, 1)),
    /INVALID_MONTH/,
  );

  assert.equal(
    formatDashboardWindowLabel(open),
    '01–13/out × 01–13/set',
  );
  assert.equal(
    formatDashboardWindowLabel(closed),
    'Setembro/2026 × Agosto/2026',
  );
  assert.equal(
    formatDashboardWindowLabel(march),
    '01–31/mar × 01–28/fev',
  );

  const leap = resolveDashboardWindow(undefined, new Date(2024, 1, 29, 12, 0, 0));
  assert.equal(leap.previousTo.getMonth(), 0);
  assert.equal(leap.previousTo.getDate(), 29);
  assert.equal(formatDashboardWindowLabel(leap), '01–29/fev × 01–29/jan');

  const april = resolveDashboardWindow(undefined, new Date(2026, 3, 30, 12, 0, 0));
  assert.equal(april.to.getDate(), 30);
  assert.equal(april.previousTo.getDate(), 30);
  assert.equal(formatDashboardWindowLabel(april), '01–30/abr × 01–30/mar');

  const may = resolveDashboardWindow(undefined, new Date(2026, 4, 31, 12, 0, 0));
  assert.equal(may.previousTo.getMonth(), 3);
  assert.equal(may.previousTo.getDate(), 30);
  assert.equal(formatDashboardWindowLabel(may), '01–31/mai × 01–30/abr');

  const january = resolveDashboardWindow(undefined, new Date(2026, 0, 15, 12, 0, 0));
  assert.equal(january.previousFrom.getFullYear(), 2025);
  assert.equal(january.previousTo.getMonth(), 11);
  assert.equal(january.previousTo.getDate(), 15);
  assert.equal(
    formatDashboardWindowLabel(january),
    '01–15/jan/2026 × 01–15/dez/2025',
  );

  const closedJanuary = resolveDashboardWindow('2026-01', new Date(2026, 1, 2));
  assert.equal(closedJanuary.complete, true);
  assert.equal(closedJanuary.previousTo.getFullYear(), 2025);
  assert.equal(closedJanuary.previousTo.getDate(), 31);
  assert.equal(
    formatDashboardWindowLabel(closedJanuary),
    'Janeiro/2026 × Dezembro/2025',
  );
}

if (require.main === module) {
  main();
}
