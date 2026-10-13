import * as assert from 'node:assert/strict';
import { resolveDashboardWindow } from './dashboard.window';

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
}

if (require.main === module) {
  main();
}
