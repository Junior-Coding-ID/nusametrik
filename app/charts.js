/* SELAT ATLAS — charts: hand-built inline SVG, zero libraries.
   Every renderer is a named top-level function; no IIFEs. */
function hexLerp(a, b, t) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const mix = pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * t); });
  return "rgb(" + mix[0] + "," + mix[1] + "," + mix[2] + ")";
}

function rampColor(ramp, t) {
  if (ramp === "brick") return hexLerp("#fbe9d3", "#b94b45", t);
  return hexLerp("#dbe7f8", "#244a92", t);
}

function tileTextColor(t) {
  return t < 0.45 ? "#17243d" : "#ffffff";
}

function svgOpen(w, h, label, extraClass) {
  const cls = extraClass ? ' chart ' + extraClass : ' chart';
  return '<svg class="' + cls.trim() + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" tabindex="0" aria-label="' + label.replace(/"/g, "") + '" xmlns="http://www.w3.org/2000/svg">';
}

function renderDivergingBars(el, series) {
  if (!el) return;
  const W = 640, H = 300, top = 26, bottom = 34, left = 44, right = 14;
  const plotH = H - top - bottom, plotW = W - left - right;
  const maxAbs = 10;
  const y0 = top + plotH * 0.5;
  const slot = plotW / series.length;
  const barW = Math.min(64, slot * 0.58);
  let s = svgOpen(W, H, "Real GDP growth 2020 to 2025: minus 5.5 percent in 2020, 3.3 in 2021, 9.0 in 2022, 3.6 in 2023, 5.2 in 2024 and 5.2 in 2025", "wide-chart");
  s += '<line class="gridline" x1="' + left + '" y1="' + top + '" x2="' + left + '" y2="' + (top + plotH) + '"/>';
  s += '<line x1="' + left + '" y1="' + y0 + '" x2="' + (W - right) + '" y2="' + y0 + '" stroke="#475569" stroke-width="1.5"/>';
  series.forEach(function (d, i) {
    const cx = left + slot * i + slot / 2;
    const h = Math.abs(d.growth) * (plotH / 2) / maxAbs;
    const y = d.growth >= 0 ? y0 - h : y0;
    const color = d.growth < 0 ? "#b94b45" : (d.year === 2025 ? "#3567c0" : "#85b3e4");
    const vy = d.growth >= 0 ? y - 18 : y + h + 16;
    s += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + Math.max(h, 2).toFixed(1) + '" rx="3" fill="' + color + '"><title>' + d.year + ': ' + d.growth.toFixed(1) + '% real GDP growth</title></rect>';
    s += '<text class="bar-value" x="' + cx + '" y="' + vy + '" text-anchor="middle">' + (d.growth > 0 ? "+" : "") + d.growth.toFixed(1) + '%</text>';
    s += '<text class="axis-label" x="' + cx + '" y="' + (H - 12) + '" text-anchor="middle">' + d.year + '</text>';
  });
  s += '<text class="axis-label" x="' + left + '" y="14">Real GDP growth, % YoY</text>';
  s += "</svg>";
  el.innerHTML = s;
}

function renderMiniCartogram(el, indicatorKey) {
  if (!el) return;
  const ind = INDICATORS[indicatorKey];
  const vals = indicatorValues(indicatorKey);
  const min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  let html = '<div class="cartogram" role="group" aria-label="Mini tile cartogram of 16 states by ' + ind.label + ' ' + ind.year + '">';
  STATES.forEach(function (st) {
    const t = max === min ? 0.5 : (st[indicatorKey] - min) / (max - min);
    const bg = rampColor(ind.ramp, t);
    const fg = tileTextColor(t);
    html += '<a class="tile" style="grid-column:' + st.gx + ';grid-row:' + st.gy + ';background:' + bg + ';color:' + fg + ';text-decoration:none;display:block;" href="states.html?indicator=' + indicatorKey + '&state=' + st.code + '" aria-label="' + st.name + ': ' + formatFullValue(indicatorKey, st[indicatorKey]) + '"><span class="t-code">' + st.code + '</span><span class="t-val">' + formatValue(indicatorKey, st[indicatorKey]) + '</span></a>';
  });
  html += "</div>";
  el.innerHTML = html;
}

function renderSectorBars(el, sectors, benchmark) {
  if (!el) return;
  const W = 640, H = 260, left = 150, right = 64, top = 30, bottom = 30;
  const plotW = W - left - right, plotH = H - top - bottom;
  const maxV = 13;
  const rowH = plotH / sectors.length;
  const benchX = left + (benchmark / maxV) * plotW;
  let s = svgOpen(W, H, "Sector growth 2025: Construction 12.2 percent, Services 5.4, Manufacturing 4.5, Agriculture 2.2, Mining and quarrying 0.6. National GDP growth 5.2 percent", "wide-chart");
  s += '<text class="axis-label" x="' + left + '" y="14">Real growth 2025, %</text>';
  sectors.forEach(function (d, i) {
    const y = top + rowH * i + 8;
    const w = (d.growth / maxV) * plotW;
    const above = d.growth >= benchmark;
    s += '<text class="bar-label" x="' + (left - 10) + '" y="' + (y + 15) + '" text-anchor="end">' + d.name + '</text>';
    s += '<rect x="' + left + '" y="' + y + '" width="' + w.toFixed(1) + '" height="24" rx="3" fill="' + (above ? "#3567c0" : "#85b3e4") + '"><title>' + d.name + ': ' + d.growth.toFixed(1) + '% in 2025' + (above ? ' — above national GDP growth' : ' — below national GDP growth') + '</title></rect>';
    s += '<text class="bar-value" x="' + (left + w + 8) + '" y="' + (y + 17) + '">' + d.growth.toFixed(1) + '%</text>';
  });
  s += '<line x1="' + benchX.toFixed(1) + '" y1="' + top + '" x2="' + benchX.toFixed(1) + '" y2="' + (top + plotH) + '" stroke="#9a681c" stroke-width="2" stroke-dasharray="5 4"/>';
  s += '<text class="axis-label" x="' + benchX.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-weight="700" fill="#9a681c">GDP 5.2%</text>';
  s += "</svg>";
  el.innerHTML = s;
}

function renderPairedBars(el, pairs, opts) {
  if (!el) return;
  const W = 300, H = 230, left = 30, right = 30, top = 30, bottom = 30;
  const plotW = W - left - right, plotH = H - top - bottom;
  const maxV = Math.max.apply(null, pairs.map(function (p) { return p.value; })) * 1.25;
  const slot = plotW / pairs.length, barW = Math.min(72, slot * 0.55);
  let s = svgOpen(W, H, opts.title + ": " + pairs.map(function (p) { return p.label + " " + p.value.toFixed(1) + opts.unit; }).join(", ") + ".");
  pairs.forEach(function (p, i) {
    const cx = left + slot * i + slot / 2;
    const h = (p.value / maxV) * plotH;
    const y = top + plotH - h;
    s += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + h.toFixed(1) + '" rx="3" fill="' + (i === pairs.length - 1 ? "#3567c0" : "#85b3e4") + '"><title>' + p.label + ': ' + p.value.toFixed(1) + opts.unit + '</title></rect>';
    s += '<text class="bar-value" x="' + cx + '" y="' + (y - 8) + '" text-anchor="middle">' + p.value.toFixed(1) + opts.unit + '</text>';
    s += '<text class="axis-label" x="' + cx + '" y="' + (H - 10) + '" text-anchor="middle">' + p.label + '</text>';
  });
  s += '<line x1="' + left + '" y1="' + (top + plotH) + '" x2="' + (W - right) + '" y2="' + (top + plotH) + '" stroke="#475569" stroke-width="1.5"/>';
  s += "</svg>";
  el.innerHTML = s;
}

function renderStackedBar(el, segments) {
  if (!el) return;
  const W = 640, H = 120, left = 16, right = 16, top = 34, barH = 34;
  const plotW = W - left - right;
  let s = svgOpen(W, H, "GDP composition 2025: services plus manufacturing 82.5 percent, all other sectors 17.5 percent", "wide-chart");
  let x = left;
  segments.forEach(function (seg) {
    const w = (seg.value / 100) * plotW;
    s += '<rect x="' + x.toFixed(1) + '" y="' + top + '" width="' + w.toFixed(1) + '" height="' + barH + '" fill="' + seg.color + '"><title>' + seg.label + ': ' + seg.value.toFixed(1) + '%</title></rect>';
    s += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (top + 22) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">' + seg.value.toFixed(1) + '%</text>';
    x += w;
  });
  s += '<text class="bar-label" x="' + left + '" y="18">Services + manufacturing — ' + segments[0].value.toFixed(1) + '% of GDP</text>';
  s += '<text class="bar-label" x="' + (W - right) + '" y="18" text-anchor="end">All other sectors — ' + segments[1].value.toFixed(1) + '%</text>';
  s += '<text class="axis-label" x="' + left + '" y="' + (top + barH + 22) + '">Shares of nominal GDP, 2025. Growth and share are different things: only Construction and Services grew faster than GDP itself.</text>';
  s += "</svg>";
  el.innerHTML = s;
}

function renderSlopeChart(el, points, opts) {
  if (!el) return;
  const W = 300, H = 230, left = 64, right = 64, top = 30, bottom = 30;
  const plotW = W - left - right, plotH = H - top - bottom;
  const vals = points.map(function (p) { return p.value; });
  let min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  const pad = (max - min) * 0.6 + 0.001;
  min -= pad; max += pad;
  function yOf(v) { return top + plotH - ((v - min) / (max - min)) * plotH; }
  const dec = opts.decimals == null ? 1 : opts.decimals;
  const delta = points[1].value - points[0].value;
  const deltaTxt = (delta > 0 ? "+" : "") + delta.toFixed(dec) + (opts.unit === "%" ? " pp" : "");
  let s = svgOpen(W, H, opts.title + ": " + points[0].label + " " + points[0].value.toFixed(dec) + opts.unit + ", " + points[1].label + " " + points[1].value.toFixed(dec) + opts.unit + ". Change " + deltaTxt + ".");
  s += '<line x1="' + left + '" y1="' + yOf(points[0].value).toFixed(1) + '" x2="' + (W - right) + '" y2="' + yOf(points[1].value).toFixed(1) + '" stroke="#3567c0" stroke-width="3"/>';
  points.forEach(function (p, i) {
    const x = i === 0 ? left : W - right;
    const y = yOf(p.value);
    s += '<circle cx="' + x + '" cy="' + y.toFixed(1) + '" r="6" fill="#3567c0"><title>' + p.label + ': ' + p.value.toFixed(dec) + opts.unit + '</title></circle>';
    s += '<text class="bar-value" x="' + x + '" y="' + (y - 12) + '" text-anchor="middle">' + p.value.toFixed(dec) + opts.unit + '</text>';
    s += '<text class="axis-label" x="' + x + '" y="' + (H - 8) + '" text-anchor="middle">' + p.label + '</text>';
  });
  s += '<text class="bar-value" x="' + (W / 2) + '" y="' + (top - 8) + '" text-anchor="middle" fill="#087f72">Change ' + deltaTxt + '</text>';
  s += "</svg>";
  el.innerHTML = s;
}

function renderDumbbell(el, data, opts) {
  if (!el) return;
  const W = 640, H = 150, left = 90, right = 90, top = 44, rowY = 78;
  const plotW = W - left - right;
  const min = 85, max = 100;
  function xOf(v) { return left + ((v - min) / (max - min)) * plotW; }
  let s = svgOpen(W, H, "Household internet access 2025: urban " + data.a.toFixed(1) + " percent, rural " + data.b.toFixed(1) + " percent. Gap " + opts.gap.toFixed(1) + " percentage points", "wide-chart");
  s += '<line x1="' + left + '" y1="' + rowY + '" x2="' + (W - right) + '" y2="' + rowY + '" stroke="#dce3ed" stroke-width="2"/>';
  s += '<line x1="' + xOf(data.b).toFixed(1) + '" y1="' + rowY + '" x2="' + xOf(data.a).toFixed(1) + '" y2="' + rowY + '" stroke="#3567c0" stroke-width="4"/>';
  s += '<circle cx="' + xOf(data.b).toFixed(1) + '" cy="' + rowY + '" r="9" fill="#f3bc65" stroke="#9a681c" stroke-width="2"><title>Rural: ' + data.b.toFixed(1) + '%</title></circle>';
  s += '<circle cx="' + xOf(data.a).toFixed(1) + '" cy="' + rowY + '" r="9" fill="#3567c0"><title>Urban: ' + data.a.toFixed(1) + '%</title></circle>';
  s += '<text class="bar-label" x="' + xOf(data.b).toFixed(1) + '" y="' + (rowY - 18) + '" text-anchor="middle">Rural ' + data.b.toFixed(1) + '%</text>';
  s += '<text class="bar-label" x="' + xOf(data.a).toFixed(1) + '" y="' + (rowY - 18) + '" text-anchor="middle">Urban ' + data.a.toFixed(1) + '%</text>';
  s += '<text class="bar-value" x="' + ((xOf(data.a) + xOf(data.b)) / 2).toFixed(1) + '" y="' + (rowY + 34) + '" text-anchor="middle">Gap ' + opts.gap.toFixed(1) + ' pp</text>';
  s += '<text class="axis-label" x="' + left + '" y="16">Households with internet access, 2025 (%)</text>';
  s += "</svg>";
  el.innerHTML = s;
}

function renderHorizontalBars(el, rows, opts) {
  if (!el) return;
  const W = 640, H = 40 + rows.length * 44, left = 130, right = 70, top = 12;
  const plotW = W - left - right;
  const max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.value; })) * 1.12;
  let s = svgOpen(W, H, rows.map(function (r) { return r.label + " " + r.value.toFixed(1) + (opts.unit || ""); }).join(", ") + "", "wide-chart");
  rows.forEach(function (r, i) {
    const y = top + i * 44;
    const w = Math.max((r.value / max) * plotW, 2);
    s += '<text class="bar-label" x="' + (left - 10) + '" y="' + (y + 17) + '" text-anchor="end">' + r.label + '</text>';
    s += '<rect x="' + left + '" y="' + y + '" width="' + w.toFixed(1) + '" height="24" rx="3" fill="#3567c0"><title>' + r.label + ': ' + r.value.toFixed(1) + (opts.unit || "") + '</title></rect>';
    s += '<text class="bar-value" x="' + (left + w + 8) + '" y="' + (y + 17) + '">' + r.value.toFixed(1) + (opts.unit || "") + '</text>';
  });
  s += "</svg>";
  el.innerHTML = s;
}
