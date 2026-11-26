// State: the seed data, plus whatever the household changes, kept in
// localStorage. No account, no network — the ledger lives in this browser.
// "Restore sample data" wipes the stored copy and re-seeds from data.js.
import { SEED } from './data.js';

const KEY = 'hearth-ledger-v1';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch {
    // A corrupt store falls back to the seed; nothing is lost that matters.
  }
  return clone(SEED);
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode / full storage: the page still works for this visit.
  }
}

export function reset() {
  localStorage.removeItem(KEY);
  return clone(SEED);
}

export function isNovember(tx) {
  return tx.d.startsWith('2026-11-');
}

// November transactions only, newest first.
export function novemberTxns(state) {
  return state.transactions.filter(isNovember).sort((a, b) => (a.d < b.d ? 1 : -1));
}

// Spent per category in November, computed from the transaction list.
export function spentByCategory(state) {
  const out = {};
  for (const cat of state.categories) out[cat.id] = 0;
  for (const tx of state.transactions) {
    if (isNovember(tx) && out[tx.c] !== undefined) out[tx.c] += tx.a;
  }
  return out;
}

export function totals(state) {
  const spent = spentByCategory(state);
  const budget = state.categories.reduce((s, c) => s + c.limit, 0);
  const spentTotal = Object.values(spent).reduce((s, n) => s + n, 0);
  return {
    income: state.income.monthly,
    budget,
    spent: spentTotal,
    balance: state.income.monthly - spentTotal,
    left: budget - spentTotal,
    spentByCategory: spent,
  };
}

export function categoryById(state, id) {
  return state.categories.find((c) => c.id === id);
}

export function billsDue(state) {
  return state.bills.filter((b) => !b.paid);
}

export function billsDueTotal(state) {
  return billsDue(state).reduce((s, b) => s + b.amount, 0);
}
