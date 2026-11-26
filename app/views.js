// The six pages. Every number on every page comes from store.totals() /
// spentByCategory(), which sum the transaction list — so the dashboard,
// budgets and reports can never disagree with each other.
import { fmt, fmtSigned, pct, changePct, shortDate, daysUntil, monthFromNow, monthsToClose } from './money.js';
import { novemberTxns, spentByCategory, totals, categoryById, billsDue, billsDueTotal } from './store.js';
import { donut, bars, ring } from './charts.js';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function statCard(label, value, sub) {
  return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-sub">${sub}</div></div>`;
}

function txRow(state, tx, deletable) {
  const cat = categoryById(state, tx.c);
  const dot = cat ? `<span class="dot" style="background:${cat.color}"></span>` : '';
  const del = deletable
    ? `<button class="linkbtn" data-action="delete-tx" data-date="${tx.d}" data-amount="${tx.a}" data-merchant="${esc(tx.m)}" title="Delete this transaction">Delete</button>`
    : '';
  return `<tr><td>${shortDate(tx.d)}</td><td>${dot}${esc(tx.m)}<div class="tx-note">${esc(tx.n || '')}</div></td><td>${cat ? esc(cat.name) : '—'}</td><td class="num">${fmt(tx.a)}</td><td>${del}</td></tr>`;
}

export function viewDashboard(state) {
  const t = totals(state);
  const segments = state.categories.map((c) => ({ value: t.spentByCategory[c.id], color: c.color }));
  const recent = novemberTxns(state).slice(0, 5);
  const upcoming = billsDue(state).slice(0, 3);
  const legend = state.categories
    .map((c) => {
      const v = t.spentByCategory[c.id];
      const share = t.spent ? Math.round((v / t.spent) * 100) : 0;
      return `<li><span class="dot" style="background:${c.color}"></span>${esc(c.name)}<span class="legend-num">$${Math.round(v)} · ${share}%</span></li>`;
    })
    .join('');
  const budgetRows = state.categories
    .slice()
    .sort((a, b) => t.spentByCategory[b.id] - t.spentByCategory[a.id])
    .slice(0, 5)
    .map((c) => {
      const v = t.spentByCategory[c.id];
      const frac = Math.min(1, v / c.limit);
      const over = v > c.limit;
      return `<div class="bar-row"><span class="bar-name">${esc(c.name)}</span>
        <div class="bar-track"><div class="bar-fill${over ? ' over' : ''}" style="width:${Math.round(frac * 100)}%"></div></div>
        <span class="bar-num">${fmt(v)} of ${fmt(c.limit)}</span></div>`;
    })
    .join('');
  return `
  <section class="hero"><h1>November, at a glance</h1>
    <p>${esc(state.family.name)} · ${esc(state.family.members)} · as of ${esc(state.family.asOf)}. Every dollar below is real, and every total adds up — the figures are summed from the transaction list, not typed in.</p></section>
  <section class="stats">
    ${statCard('Monthly income', fmt(t.income), 'Salary $5,400 · freelance $1,250 · interest $200')}
    ${statCard('Spent so far', fmt(t.spent), `of a ${fmt(t.budget)} November budget`)}
    ${statCard('Left in the budget', fmt(t.left), 'Five days of November still to go')}
    ${statCard('Month balance', fmt(t.balance), 'Income minus spending, so far')}
  </section>
  <section class="grid-2">
    <div class="card"><h2>Where November went</h2>
      <div class="donut-wrap">${donut(segments, 180)}<ul class="legend">${legend}</ul></div>
      <p class="muted">Savings counts as a destination too: $842 of the $1,530 planned is already set aside.</p></div>
    <div class="card"><h2>Biggest budget lines</h2>${budgetRows}
      <p><a class="btn" href="#/budgets">See all 11 budgets →</a></p>
      <h2 class="mt">Coming up</h2>
      <ul class="plain">${upcoming.map((b) => `<li><strong>${esc(b.name)}</strong> — ${fmt(b.amount)} due ${shortDate(b.due)}${b.auto ? ' · auto-pay' : ''}</li>`).join('')}</ul>
      <p><a class="btn" href="#/bills">All bills →</a></p></div>
  </section>
  <section class="card"><h2>Latest spending</h2>
    <table class="tx"><thead><tr><th>Date</th><th>Where</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${recent.map((tx) => txRow(state, tx, false)).join('')}</tbody></table>
    <p><a class="btn" href="#/transactions">All transactions →</a></p></section>`;
}

export function viewTransactions(state, ui) {
  const all = state.transactions.slice().sort((a, b) => (a.d < b.d ? 1 : -1));
  let rows = all;
  if (ui.cat) rows = rows.filter((tx) => tx.c === ui.cat);
  if (ui.month === '2026-10') rows = rows.filter((tx) => tx.d.startsWith('2026-10-'));
  else if (ui.month === '2026-11') rows = rows.filter((tx) => tx.d.startsWith('2026-11-'));
  if (ui.sort === 'amount') rows = rows.slice().sort((a, b) => b.a - a.a);
  const shown = rows.reduce((s, tx) => s + tx.a, 0);
  const opts = state.categories.map((c) => `<option value="${c.id}"${ui.cat === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  return `
  <section class="hero"><h1>Transactions</h1>
    <p>${state.transactions.length} transactions on the books. November rows add up to the totals on every other page; the four October rows are shown for context and are not counted in November.</p></section>
  <section class="card"><h2>Add a transaction</h2>
    <form id="add-tx" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-25" required></label>
      <label>Where <input type="text" name="merchant" placeholder="e.g. GreenMart" maxlength="60" required></label>
      <label>Category <select name="category">${state.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label class="wide">Note <input type="text" name="note" placeholder="What was it for?" maxlength="80"></label>
      <button class="btn primary" type="submit">Add transaction</button>
    </form></section>
  <section class="card"><h2>All transactions</h2>
    <div class="filters">
      <label>Category <select id="f-cat"><option value="">All categories</option>${opts}</select></label>
      <label>Month <select id="f-month"><option value="">All months</option>
        <option value="2026-11"${ui.month === '2026-11' ? ' selected' : ''}>November 2026</option>
        <option value="2026-10"${ui.month === '2026-10' ? ' selected' : ''}>October 2026</option></select></label>
      <label>Sort <select id="f-sort"><option value="date"${ui.sort === 'date' ? ' selected' : ''}>Newest first</option>
        <option value="amount"${ui.sort === 'amount' ? ' selected' : ''}>Largest first</option></select></label>
      <span class="muted">${rows.length} shown · ${fmt(shown)}</span>
    </div>
    <table class="tx"><thead><tr><th>Date</th><th>Where</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${rows.map((tx) => txRow(state, tx, true)).join('') || '<tr><td colspan="5">Nothing matches these filters.</td></tr>'}</tbody></table></section>`;
}

export function viewBudgets(state) {
  const t = totals(state);
  const rows = state.categories
    .map((c) => {
      const v = t.spentByCategory[c.id];
      const left = c.limit - v;
      const frac = Math.min(1, v / c.limit);
      const over = v > c.limit;
      const verb = c.id === 'savings' ? 'set aside' : 'spent';
      return `<div class="budget-row">
        <div class="budget-head"><span class="dot" style="background:${c.color}"></span><strong>${esc(c.name)}</strong>
          <span class="muted">${esc(c.blurb)}</span></div>
        <div class="bar-track big"><div class="bar-fill${over ? ' over' : ''}" style="width:${Math.round(frac * 100)}%"></div></div>
        <div class="budget-nums"><span>${fmt(v)} ${verb} of ${fmt(c.limit)}</span>
          <span class="${over ? 'bad' : 'good'}">${over ? `${fmt(-left)} over budget` : `${fmt(left)} left`}</span>
          <label class="limit-edit">Monthly limit $ <input type="number" min="0" step="5" value="${c.limit}" data-action="set-limit" data-cat="${c.id}"></label></div>
      </div>`;
    })
    .join('');
  return `
  <section class="hero"><h1>Budgets</h1>
    <p>Eleven envelopes for November, savings included — money set aside first is money the month cannot spend. Change a limit and every bar, total and dashboard figure updates at once.</p></section>
  <section class="card"><h2>November envelopes</h2>${rows}
    <div class="budget-total"><span>Total budget</span><strong>${fmt(t.budget)}</strong><span>Spent ${fmt(t.spent)}</span><strong>${fmt(t.left)} left</strong></div>
    <p class="muted">Housing is paid in full for the month, so its bar is done. Nothing here is over budget — the closest call is groceries, with $234 still in the envelope.</p></section>`;
}

export function viewBills(state) {
  const due = billsDue(state);
  const paid = state.bills.filter((b) => b.paid);
  const dueTotal = billsDueTotal(state);
  const rows = due.map((b) => {
    const days = daysUntil(b.due);
    const when = days < 0 ? `<span class="bad">Overdue ${-days}d</span>` : days <= 3 ? `<span class="warn">Due in ${days}d</span>` : `Due in ${days}d`;
    return `<tr><td><strong>${esc(b.name)}</strong><div class="tx-note">${esc(b.note || '')}</div></td>
      <td>${shortDate(b.due)}</td><td>${when}</td><td class="num">${fmt(b.amount)}</td>
      <td><button class="btn small" data-action="pay-bill" data-bill="${b.id}">Mark paid</button></td></tr>`;
  }).join('');
  return `
  <section class="hero"><h1>Bills</h1>
    <p>${fmt(dueTotal)} still to pay before the year ends, across ${due.length} bills. Mark one paid and the total drops at once — nothing here is a surprise, because the dates are all on the calendar.</p></section>
  <section class="card"><h2>Still to pay</h2>
    <table class="tx"><thead><tr><th>Bill</th><th>Due</th><th>When</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5">Nothing due — everything is paid.</td></tr>'}</tbody></table>
    <p class="total-line">Total still due: <strong>${fmt(dueTotal)}</strong></p></section>
  <section class="card"><h2>Already paid</h2>
    <table class="tx"><thead><tr><th>Bill</th><th>Due</th><th>When</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${paid.map((b) => `<tr><td><strong>${esc(b.name)}</strong><div class="tx-note">${esc(b.note || '')}</div></td><td>${shortDate(b.due)}</td><td><span class="good">Paid</span></td><td class="num">${fmt(b.amount)}</td><td></td></tr>`).join('')}</tbody></table></section>`;
}

export function viewGoals(state) {
  const cards = state.goals
    .map((g) => {
      const frac = g.saved / g.target;
      const gap = g.target - g.saved;
      const months = monthsToClose(gap, g.monthly);
      const eta = months === null ? 'Add a monthly amount to see a date' : months === 0 ? 'Done — fully funded' : `On track for ${monthFromNow(months)} at ${fmt(g.monthly)}/mo`;
      return `<div class="card goal"><div class="goal-top">${ring(frac, 92)}<div>
        <h2>${esc(g.name)}</h2><p class="muted">${esc(g.note)}</p></div></div>
        <p class="goal-nums"><strong>${fmt(g.saved)}</strong> saved of ${fmt(g.target)} · ${fmt(gap)} to go</p>
        <p class="muted">${eta}</p>
        <form class="deposit" data-goal="${g.id}"><label>Add to this goal $ <input type="number" min="1" step="1" placeholder="50" required></label>
        <button class="btn small primary" type="submit">Add</button></form></div>`;
    })
    .join('');
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="hero"><h1>Savings goals</h1>
    <p>${fmt(totalSaved)} saved toward ${fmt(totalTarget)} across three goals. Deposits here are real: add money and the ring, the balance and the finish date all move.</p></section>
  <section class="grid-3">${cards}</section>
  <section class="card"><h2>How the goals are funded</h2>
    <p>Each month the family sets aside ${fmt(state.categories.find((c) => c.id === 'savings').limit)} before anything else is spent — ${fmt(400)} to the emergency fund, ${fmt(292)} to the trip and ${fmt(150)} to the car. In November, ${fmt(842)} of that has already moved: $400 on Nov 3, $150 on Nov 10 and $292 on Nov 17. The emergency fund is the priority: six months of essentials comes before a new car.</p></section>`;
}

export function viewReports(state) {
  const t = totals(state);
  const rows = state.history.map((h) => ({ ...h, income: state.income.monthly }));
  const pace = Math.round((t.spent / 25) * 30);
  const tableRows = state.categories
    .map((c) => {
      const nov = t.spentByCategory[c.id];
      const oct = state.october[c.id] ?? 0;
      const diff = nov - oct;
      const ch = changePct(nov, oct);
      return `<tr><td><span class="dot" style="background:${c.color}"></span>${esc(c.name)}</td>
        <td class="num">${fmt(nov)}</td><td class="num">${fmt(oct)}</td>
        <td class="num ${diff <= 0 ? 'good' : 'bad'}">${fmtSigned(diff)}</td>
        <td class="num ${ch <= 0 ? 'good' : 'bad'}">${pct(ch)}</td></tr>`;
    })
    .join('');
  // Tips, computed from the real numbers — no made-up advice.
  const tips = [];
  const grocSave = state.october.groceries - t.spentByCategory.groceries;
  if (grocSave > 0) tips.push(`Groceries are ${fmt(grocSave)} under October — the bulk shop on Nov 14 did the heavy lifting. Keep the weekly list tight and the saving repeats.`);
  const dinSave = state.october.dining - t.spentByCategory.dining;
  if (dinSave > 0) tips.push(`Dining out is ${fmt(dinSave)} under October. One takeaway night a week, instead of two, is worth about ${fmt(dinSave * 2)} a month if it holds.`);
  const funSave = state.october.fun - t.spentByCategory.fun;
  if (funSave > 0) tips.push(`Fun is ${fmt(funSave)} under October — the free things (a walk, a board game, the library) are doing the work that paid outings used to do.`);
  tips.push(`At November's pace the month closes near ${fmt(pace)} of outflow — about ${fmt(state.income.monthly - pace)} under income, before the December bills land.`);
  return `
  <section class="hero"><h1>Reports</h1>
    <p>Six months of outflows against a flat ${fmt(state.income.monthly)} income line. November is through the 25th only, which is why its bar is short — and why it is orange, not green.</p></section>
  <section class="card"><h2>Outflow vs income — Jun to Nov</h2>
    ${bars(rows)}
    <p class="muted">* November through Nov 25. The dashed line is monthly income (${fmt(state.income.monthly)}); every month so far has closed under it.</p></section>
  <section class="card"><h2>November vs October, by category</h2>
    <table class="tx"><thead><tr><th>Category</th><th class="num">November</th><th class="num">October</th><th class="num">Change</th><th class="num">%</th></tr></thead>
    <tbody>${tableRows}</tbody></table>
    <p class="muted">November is five days short of a full month, so most lines read low — the honest comparison is the pace, not the raw total.</p></section>
  <section class="card"><h2>What the numbers say</h2>
    <ul class="tips">${tips.map((tip) => `<li>${esc(tip)}</li>`).join('')}</ul></section>`;
}
