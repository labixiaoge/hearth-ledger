// Hearth Ledger — seed data for the Marlow family, November 2026.
//
// Every number reconciles by construction:
//   income  $6,850  = 5,400 salary + 1,250 freelance + 200 interest/cashback
//   budget  $5,900  = sum of the 11 category limits below
//   spent   $4,312  = sum of the November transactions (Nov 1–25)
//   balance $2,538  = 6,850 − 4,312
//   left    $1,588  = 5,900 − 4,312
// The app never hard-codes a spent figure: it sums the transaction list, so
// the dashboard, budgets and reports can never disagree with each other.
// The four late-October transactions are shown in the list but excluded
// from November sums.

export const SEED = {
  family: {
    name: 'The Marlow family',
    members: 'Maya & Jon, Sofia (9) & Leo (6)',
    month: 'November 2026',
    asOf: 'Nov 25, 2026',
  },
  income: {
    monthly: 6850,
    items: [
      { label: 'Maya — salary', amount: 5400 },
      { label: 'Jon — freelance', amount: 1250 },
      { label: 'Interest & cashback', amount: 200 },
    ],
  },
  categories: [
    { id: 'housing', name: 'Housing', limit: 1850, color: '#2F5233', blurb: 'Mortgage, paid in full Nov 1.' },
    { id: 'groceries', name: 'Groceries', limit: 720, color: '#7A9B57', blurb: 'Weekly shops at GreenMart and the farmers market.' },
    { id: 'transport', name: 'Transport', limit: 410, color: '#4A7FA5', blurb: 'Gas, metro cards, parking and the odd ride.' },
    { id: 'utilities', name: 'Utilities', limit: 260, color: '#E0A458', blurb: 'Electric, internet, water and mobile.' },
    { id: 'dining', name: 'Dining out', limit: 180, color: '#C96F4A', blurb: 'One takeaway night a week, more or less.' },
    { id: 'kids', name: 'Kids', limit: 320, color: '#8E6FB8', blurb: 'Music lessons, school lunches, shoes and books.' },
    { id: 'health', name: 'Health', limit: 210, color: '#5BA8A0', blurb: 'Pharmacy, dentist and vitamins.' },
    { id: 'fun', name: 'Fun & leisure', limit: 150, color: '#D97B9F', blurb: 'Movies, games, streaming and ice cream.' },
    { id: 'clothing', name: 'Clothing', limit: 120, color: '#9C7B54', blurb: 'Winter layers as the cold sets in.' },
    { id: 'misc', name: 'Misc', limit: 150, color: '#8A8D91', blurb: 'Hardware, gifts and pet food.' },
    { id: 'savings', name: 'Savings', limit: 1530, color: '#C9A227', blurb: 'Set aside first, before the month spends it.' },
  ],
  // November transactions, Nov 1–25. Category sums (check them!):
  //   housing 1850 · groceries 486 · transport 268 · utilities 214
  //   dining 142 · kids 205 · health 96 · fun 87 · clothing 64
  //   misc 58 · savings 842 — total $4,312.
  transactions: [
    { d: '2026-11-01', m: 'First National Bank', c: 'housing', a: 1850.0, n: 'November mortgage' },
    { d: '2026-11-02', m: 'GreenMart', c: 'groceries', a: 86.4, n: 'Weekly shop' },
    { d: '2026-11-03', m: 'Shell', c: 'transport', a: 42.0, n: 'Gas' },
    { d: '2026-11-03', m: 'Transfer to savings', c: 'savings', a: 400.0, n: 'Emergency fund' },
    { d: '2026-11-04', m: 'City Power', c: 'utilities', a: 96.4, n: 'Electric bill' },
    { d: '2026-11-04', m: 'Hardware Corner', c: 'misc', a: 21.3, n: 'Light bulbs and a hinge' },
    { d: '2026-11-05', m: 'GreenMart', c: 'groceries', a: 64.25, n: 'Weekly shop' },
    { d: '2026-11-05', m: 'Music School', c: 'kids', a: 90.0, n: "Sofia's piano, November" },
    { d: '2026-11-06', m: 'Noodle House', c: 'dining', a: 28.5, n: 'Takeaway Friday' },
    { d: '2026-11-07', m: 'Metro', c: 'transport', a: 36.0, n: 'Two monthly cards' },
    { d: '2026-11-07', m: 'Pharmacy', c: 'health', a: 28.9, n: 'Cold medicine' },
    { d: '2026-11-08', m: 'Farmers Market', c: 'groceries', a: 38.5, n: 'Vegetables and eggs' },
    { d: '2026-11-08', m: 'Cinema', c: 'fun', a: 26.0, n: 'Family movie night' },
    { d: '2026-11-09', m: 'NorthNet', c: 'utilities', a: 65.0, n: 'Internet, auto-pay' },
    { d: '2026-11-09', m: 'School Cafeteria', c: 'kids', a: 32.5, n: 'Lunch money, two weeks' },
    { d: '2026-11-10', m: 'Transfer to savings', c: 'savings', a: 150.0, n: 'Car down payment' },
    { d: '2026-11-10', m: 'Pizza Night', c: 'dining', a: 34.0, n: 'Two large, one veggie' },
    { d: '2026-11-10', m: 'Outfitters', c: 'clothing', a: 48.0, n: "Leo's winter jacket" },
    { d: '2026-11-11', m: 'GreenMart', c: 'groceries', a: 72.15, n: 'Weekly shop' },
    { d: '2026-11-12', m: 'Shell', c: 'transport', a: 48.5, n: 'Gas' },
    { d: '2026-11-12', m: 'Toy & Game', c: 'fun', a: 31.5, n: 'Board game for rainy days' },
    { d: '2026-11-13', m: 'Corner Café', c: 'dining', a: 12.75, n: 'Coffee and a pastry' },
    { d: '2026-11-13', m: 'Gift Wrap Co.', c: 'misc', a: 9.7, n: 'Wrapping paper and ribbon' },
    { d: '2026-11-14', m: 'Costco', c: 'groceries', a: 94.8, n: 'Bulk shop' },
    { d: '2026-11-14', m: 'Dental Care', c: 'health', a: 45.0, n: 'Check-up copay' },
    { d: '2026-11-15', m: 'City Water', c: 'utilities', a: 38.2, n: 'Water bill' },
    { d: '2026-11-15', m: 'StreamBox', c: 'fun', a: 15.49, n: 'Monthly streaming' },
    { d: '2026-11-16', m: 'City Parking', c: 'transport', a: 24.0, n: 'Downtown parking' },
    { d: '2026-11-17', m: 'Transfer to savings', c: 'savings', a: 292.0, n: 'Family trip fund' },
    { d: '2026-11-17', m: 'Shoe Store', c: 'kids', a: 58.0, n: "Sofia's school shoes" },
    { d: '2026-11-18', m: 'GreenMart', c: 'groceries', a: 41.3, n: 'Top-up shop' },
    { d: '2026-11-18', m: 'Outfitters', c: 'clothing', a: 16.0, n: 'Socks and a tee' },
    { d: '2026-11-19', m: 'Sushi Bar', c: 'dining', a: 41.25, n: 'Birthday dinner for Jon' },
    { d: '2026-11-20', m: 'VitaPlus', c: 'health', a: 22.1, n: 'Vitamins' },
    { d: '2026-11-20', m: 'Pet Supply', c: 'misc', a: 27.0, n: 'Dog food, 15 lb bag' },
    { d: '2026-11-21', m: 'GreenMart', c: 'groceries', a: 58.6, n: 'Weekly shop' },
    { d: '2026-11-21', m: 'Shell', c: 'transport', a: 52.0, n: 'Gas' },
    { d: '2026-11-21', m: 'Ice Cream Parlor', c: 'fun', a: 14.01, n: 'Two scoops each' },
    { d: '2026-11-22', m: 'Mobile Plus', c: 'utilities', a: 14.4, n: 'Data top-up' },
    { d: '2026-11-22', m: 'Bookshop', c: 'kids', a: 24.5, n: 'Two storybooks' },
    { d: '2026-11-23', m: 'Bakery Lunch', c: 'dining', a: 25.5, n: 'Soup and sandwiches' },
    { d: '2026-11-24', m: 'GreenMart', c: 'groceries', a: 30.0, n: 'Milk, bread, fruit' },
    { d: '2026-11-24', m: 'RideShare', c: 'transport', a: 65.5, n: 'Airport run for grandma' },
    // Late October — shown for context, not counted in November sums.
    { d: '2026-10-28', m: 'GreenMart', c: 'groceries', a: 52.1, n: 'Weekly shop' },
    { d: '2026-10-29', m: 'Shell', c: 'transport', a: 18.0, n: 'Gas' },
    { d: '2026-10-30', m: 'Noodle House', c: 'dining', a: 24.5, n: 'Takeaway Friday' },
    { d: '2026-10-31', m: 'Costume Shop', c: 'kids', a: 32.0, n: 'Halloween costumes' },
  ],
  bills: [
    { id: 'b-nov-mortgage', name: 'Mortgage', due: '2026-11-01', amount: 1850, note: 'Paid Nov 1', paid: true },
    { id: 'b-nov-internet', name: 'Internet', due: '2026-11-09', amount: 65, note: 'Auto-pay', auto: true, paid: true },
    { id: 'b-dec-mortgage', name: 'Mortgage', due: '2026-12-01', amount: 1850, note: 'First of the month', paid: false },
    { id: 'b-dec-music', name: 'Music lessons — Sofia & Leo', due: '2026-12-05', amount: 90, note: 'Monthly', paid: false },
    { id: 'b-dec-internet', name: 'Internet', due: '2026-12-09', amount: 65, note: 'Auto-pay on', auto: true, paid: false },
    { id: 'b-dec-water', name: 'Water', due: '2026-12-12', amount: 42, note: 'Estimated', paid: false },
    { id: 'b-dec-electric', name: 'Electric', due: '2026-12-15', amount: 132, note: 'Estimated — winter rate', paid: false },
    { id: 'b-dec-insurance', name: 'Home insurance', due: '2026-12-20', amount: 148, note: 'Quarterly', paid: false },
  ],
  goals: [
    { id: 'g-emergency', name: 'Emergency fund', target: 10000, saved: 6820, monthly: 400, note: 'Six months of essentials, for the month nobody plans.' },
    { id: 'g-trip', name: 'Family trip — coast cabin', target: 2400, saved: 1080, monthly: 292, note: 'A week by the sea next spring.' },
    { id: 'g-car', name: 'Car down payment', target: 6000, saved: 2400, monthly: 150, note: 'Replacing the old sedan before it gives up.' },
  ],
  // Monthly outflows (spending + savings set aside), Jun–Nov 2026.
  // November is through Nov 25, so it reads low — that is the point.
  history: [
    { m: 'Jun', out: 5410 },
    { m: 'Jul', out: 5680 },
    { m: 'Aug', out: 5230 },
    { m: 'Sep', out: 5905 },
    { m: 'Oct', out: 5640 },
    { m: 'Nov', out: 4312, partial: true },
  ],
  // October spent per category, for the Nov-vs-Oct comparison.
  // Sums to $5,640, matching October's outflow above.
  october: {
    housing: 1850, groceries: 612, transport: 356, utilities: 241,
    dining: 198, kids: 287, health: 143, fun: 132, clothing: 96,
    misc: 104, savings: 1621,
  },
};
