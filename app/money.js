// Money and date helpers — one place, so every page formats the same way.

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function fmt(n) {
  return usd.format(n);
}

export function fmtSigned(n) {
  return (n < 0 ? '−' : '+') + usd.format(Math.abs(n));
}

export function pct(n) {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
}

// Percent change from `from` to `to`, e.g. −20.6 for 486 vs 612.
export function changePct(to, from) {
  if (!from) return 0;
  return ((to - from) / from) * 100;
}

// "Nov 24" from "2026-11-24".
export function shortDate(iso) {
  const [, m, d] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${names[m - 1]} ${d}`;
}

// Whole days from today (real today) to an ISO date. Negative = past.
export function daysUntil(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

// "Dec 2026" style label `months` months from now.
export function monthFromNow(months) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + months, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Whole months needed to close a gap at a monthly rate. 0 rate = never.
export function monthsToClose(gap, monthly) {
  if (gap <= 0) return 0;
  if (!monthly || monthly <= 0) return null;
  return Math.ceil(gap / monthly);
}
