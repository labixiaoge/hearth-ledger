// Hand-drawn SVG charts — no chart library, no network.
// donut(): a ring chart of category spending, with a hole for the total.
// bars(): a plain bar chart for the six-month history, with a dashed
// income line so the eye can compare outflow against income at a glance.

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const [sx, sy] = polar(cx, cy, r, startDeg);
  const [ex, ey] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

export function donut(segments, size = 220) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const stroke = 30;
  let angle = 0;
  const arcs = segments
    .filter((x) => x.value > 0)
    .map((x) => {
      const sweep = (x.value / total) * 360;
      const start = angle;
      angle += sweep;
      // A hairline gap between slices so neighbours stay readable.
      const gap = 1.2;
      const d = arcPath(cx, cy, r, start + gap / 2, Math.max(start + gap / 2, angle - gap / 2));
      return `<path d="${d}" fill="none" stroke="${x.color}" stroke-width="${stroke}" />`;
    })
    .join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#EFE7D6" stroke-width="${stroke}" />
    ${arcs}
  </svg>`;
}

export function bars(rows, width = 640, height = 260) {
  const max = Math.max(...rows.map((r) => Math.max(r.out, r.income ?? 0)), 1);
  const padL = 8;
  const padB = 26;
  const padT = 30;
  const plotH = height - padB - padT;
  const n = rows.length;
  const slot = (width - padL * 2) / n;
  const barW = Math.min(56, slot * 0.55);
  const y = (v) => padT + plotH - (v / max) * plotH;
  const incomeY = rows[0].income ? y(rows[0].income) : null;
  const rects = rows
    .map((r, i) => {
      const x = padL + slot * i + (slot - barW) / 2;
      const h = Math.max(2, plotH - (y(r.out) - padT));
      const fill = r.partial ? '#C96F4A' : '#2F5233';
      return `<rect x="${x.toFixed(1)}" y="${y(r.out).toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" rx="4" fill="${fill}" />
        <text x="${(x + barW / 2).toFixed(1)}" y="${(y(r.out) - 6).toFixed(1)}" text-anchor="middle" font-size="12" fill="#4A4438">$${r.out.toLocaleString()}</text>
        <text x="${(padL + slot * i + slot / 2).toFixed(1)}" y="${(height - 8).toFixed(1)}" text-anchor="middle" font-size="12" fill="#4A4438">${r.m}${r.partial ? ' *' : ''}</text>`;
    })
    .join('');
  const incomeLine = incomeY
    ? `<line x1="${padL}" x2="${width - padL}" y1="${incomeY.toFixed(1)}" y2="${incomeY.toFixed(1)}" stroke="#C9A227" stroke-width="2" stroke-dasharray="6 4" />
       <text x="${width - padL}" y="${(incomeY + 16).toFixed(1)}" text-anchor="end" font-size="12" fill="#8A6D1B">Income $${rows[0].income.toLocaleString()}</text>`
    : '';
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Monthly outflow, last six months">
    ${incomeLine}${rects}
  </svg>`;
}

// A thin progress ring for a savings goal: `frac` 0–1.
export function ring(frac, size = 84, color = '#2F5233') {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const done = Math.max(0, Math.min(1, frac));
  const cx = size / 2;
  const cy = size / 2;
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${Math.round(done * 100)} percent saved">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#EFE7D6" stroke-width="9" />
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"
      stroke-dasharray="${(c * done).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})" />
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="17" font-weight="700" fill="#2F5233">${Math.round(done * 100)}%</text>
  </svg>`;
}
