# Hearth Ledger

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/labixiaoge/hearth-ledger/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/labixiaoge/hearth-ledger/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth Ledger is a household budget site for the Marlow family — Maya &amp; Jon, Sofia (9) &amp; Leo (6) — through November 2026. One honest ledger: income, spending, bills, savings goals and reports, where every total is summed from the transaction list, so the numbers always reconcile.

## What it does

- **Dashboard** — income, spending, budget left and month balance at a glance; a donut of where November went; the biggest budget lines and the bills coming up.
- **Transactions** — add or delete a transaction, filter by category or month, sort by date or amount. The totals on every page update at once.
- **Budgets** — eleven envelopes for November, savings included. Change a monthly limit and every bar and total re-computes.
- **Bills** — what is still due before the year ends, with due-soon warnings; mark a bill paid and the total drops.
- **Goals** — emergency fund, family trip and car down payment, with progress rings, monthly rates and finish dates computed from the real numbers. Deposit money and the ring moves.
- **Reports** — six months of outflows against the income line, a November-vs-October table per category, and saving tips computed from the actual figures.

## The numbers (November, through Nov 25)

Income **$6,850** (salary $5,400 + freelance $1,250 + interest $200). Budget **$5,900** across 11 categories. Spent **$4,312**. Left in the budget **$1,588**. Month balance **$2,538**. Savings set aside: **$842** of a $1,530 plan.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network at runtime: plain static files in `app/`, data saved in the browser's localStorage. `node main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=j11gmnzr&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
