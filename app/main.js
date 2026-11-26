// Hash routing + event wiring. One render per hash change; every control
// writes through the store and re-renders, so the page never shows a stale
// number after an edit.
import { load, save, reset, categoryById } from './store.js';
import { viewDashboard, viewTransactions, viewBudgets, viewBills, viewGoals, viewReports } from './views.js';

const ROUTES = {
  '': viewDashboard,
  'transactions': viewTransactions,
  'budgets': viewBudgets,
  'bills': viewBills,
  'goals': viewGoals,
  'reports': viewReports,
};

let state = load();
// Filter/sort choices for the transactions page (kept in memory, not saved).
const ui = { cat: '', month: '', sort: 'date' };

const app = document.getElementById('app');

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const view = ROUTES[hash] ?? ROUTES[''];
  app.innerHTML = view(state, ui);
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#/${hash}`);
  });
  window.scrollTo(0, 0);
}

function rerender() {
  save(state);
  route();
}

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.id === 'add-tx') {
    event.preventDefault();
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    const date = String(data.get('date'));
    const merchant = String(data.get('merchant')).trim();
    const cat = String(data.get('category'));
    if (!merchant || !amount || amount <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !categoryById(state, cat)) return;
    state.transactions.push({
      d: date,
      m: merchant.slice(0, 60),
      c: cat,
      a: Math.round(amount * 100) / 100,
      n: String(data.get('note') || '').slice(0, 80),
    });
    rerender();
    return;
  }
  if (form.classList.contains('deposit')) {
    event.preventDefault();
    const goal = state.goals.find((g) => g.id === form.dataset.goal);
    const input = form.querySelector('input');
    const amount = Number(input.value);
    if (!goal || !amount || amount <= 0) return;
    goal.saved = Math.round((goal.saved + amount) * 100) / 100;
    rerender();
  }
});

document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.id === 'f-cat') { ui.cat = el.value; route(); }
  if (el.id === 'f-month') { ui.month = el.value; route(); }
  if (el.id === 'f-sort') { ui.sort = el.value; route(); }
  if (el.dataset.action === 'set-limit') {
    const cat = categoryById(state, el.dataset.cat);
    const value = Number(el.value);
    if (cat && value >= 0) {
      cat.limit = Math.round(value);
      rerender();
    }
  }
});

document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'delete-tx') {
    const { date, amount, merchant } = el.dataset;
    const index = state.transactions.findIndex(
      (tx) => tx.d === date && String(tx.a) === amount && tx.m === merchant,
    );
    if (index >= 0 && confirm(`Delete the ${merchant} transaction of $${amount} on ${date}?`)) {
      state.transactions.splice(index, 1);
      rerender();
    }
    return;
  }
  if (el.dataset.action === 'pay-bill') {
    const bill = state.bills.find((b) => b.id === el.dataset.bill);
    if (bill) {
      bill.paid = true;
      rerender();
    }
    return;
  }
  if (el.dataset.action === 'reset-data') {
    if (confirm('Restore the Marlow family sample data? Your changes will be lost.')) {
      state = reset();
      rerender();
    }
  }
});

window.addEventListener('hashchange', route);
route();
