/* SELAT ATLAS — State Explorer: tile cartogram, ranking, comparison.
   All four explorer components stay in sync when the indicator changes.
   No data is guessed: only the 64 verified cells in data-states.js. */
let explorerState = {
  indicator: "population",
  search: "",
  group: "all",
  sort: "desc",
  selected: null,
  compareA: "SGR",
  compareB: "SBH"
};

function explorerFiltered() {
  const q = explorerState.search.trim().toLowerCase();
  return STATES.filter(function (s) {
    if (explorerState.group !== "all" && s.group !== explorerState.group) return false;
    if (q && s.name.toLowerCase().indexOf(q) === -1 && s.code.toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
}

function explorerSorted(list) {
  const key = explorerState.indicator;
  const copy = list.slice();
  if (explorerState.sort === "asc") copy.sort(function (a, b) { return a[key] - b[key]; });
  else if (explorerState.sort === "alpha") copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
  else copy.sort(function (a, b) { return b[key] - a[key]; });
  return copy;
}

function renderExplorerCartogram() {
  const el = document.getElementById("cartogram");
  if (!el) return;
  const ind = INDICATORS[explorerState.indicator];
  const vals = indicatorValues(explorerState.indicator);
  const min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  const visible = explorerFiltered();
  const visibleCodes = {};
  visible.forEach(function (s) { visibleCodes[s.code] = true; });
  let html = "";
  STATES.forEach(function (st) {
    const t = max === min ? 0.5 : (st[indicatorKey()] - min) / (max - min);
    const bg = rampColor(ind.ramp, t);
    const fg = tileTextColor(t);
    const dim = visibleCodes[st.code] ? "" : " dim";
    const pressed = explorerState.selected === st.code ? "true" : "false";
    html += '<button type="button" class="tile' + dim + '" style="grid-column:' + st.gx + ';grid-row:' + st.gy + ';background:' + bg + ';color:' + fg + '" data-code="' + st.code + '" aria-pressed="' + pressed + '" aria-label="' + st.name + ': ' + formatFullValue(explorerState.indicator, st[explorerState.indicator]) + '"><span class="t-code">' + st.code + '</span><span class="t-val">' + formatValue(explorerState.indicator, st[explorerState.indicator]) + '</span><span class="t-name">' + st.name + '</span></button>';
  });
  el.innerHTML = html;
  const legend = document.getElementById("cartogram-legend");
  if (legend) {
    const grad = ind.ramp === "brick"
      ? "linear-gradient(90deg,#fbe9d3,#b94b45)"
      : "linear-gradient(90deg,#dbe7f8,#244a92)";
    legend.innerHTML = '<span>' + ind.label + ' ' + ind.year + ' — low</span><span class="swatch" style="background:' + grad + '"></span><span>high</span><span class="muted">· ' + ind.unit + '</span>';
  }
  el.querySelectorAll(".tile").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const code = btn.getAttribute("data-code");
      const st = stateByCode(code);
      if (!st) return;
      if (explorerState.group !== "all" && st.group !== explorerState.group) {
        explorerState.group = "all";
        const gf = document.getElementById("group-filter");
        if (gf) gf.value = "all";
      }
      explorerState.selected = code;
      renderExplorerAll();
    });
  });
}

function indicatorKey() {
  return explorerState.indicator;
}

function renderExplorerRanking() {
  const el = document.getElementById("ranking");
  if (!el) return;
  const ind = INDICATORS[explorerState.indicator];
  const list = explorerSorted(explorerFiltered());
  if (list.length === 0) {
    el.innerHTML = '<div class="empty">No states match your search or filter. <button type="button" class="btn ghost" id="empty-reset">Clear search &amp; filters</button></div>';
    const b = document.getElementById("empty-reset");
    if (b) b.addEventListener("click", resetExplorer);
    return;
  }
  const max = Math.max.apply(null, list.map(function (s) { return s[ind.key]; }));
  let html = '<table class="data"><thead><tr><th>#</th><th>State</th><th>Group</th><th class="num">' + ind.label + ' (' + ind.year + ')</th><th class="num">vs national</th></tr></thead><tbody>';
  list.forEach(function (s, i) {
    const diff = ind.key === "income"
      ? (s[ind.key] >= ind.benchmark ? "+" : "") + "RM" + formatInt(s[ind.key] - ind.benchmark)
      : (s[ind.key] >= ind.benchmark ? "+" : "") + (s[ind.key] - ind.benchmark).toFixed(1) + (ind.format === "percent1" ? " pp" : "");
    html += '<tr><td>' + (i + 1) + '</td><td><strong>' + s.name + '</strong> <span class="muted">' + s.code + '</span></td><td>' + s.group + '</td><td class="num"><strong>' + formatFullValue(ind.key, s[ind.key]) + '</strong></td><td class="num">' + diff + '</td></tr>';
  });
  html += '</tbody></table>';
  html += '<div style="margin-top:10px"><div id="ranking-bars"></div></div>';
  el.innerHTML = html;
  const barsEl = document.getElementById("ranking-bars");
  if (barsEl) {
    renderHorizontalBars(barsEl, list.map(function (s) {
      return { label: s.name, value: s[ind.key] };
    }), { unit: ind.format === "percent1" ? "%" : (ind.format === "rm" ? "" : "") });
  }
  void max;
}

function renderExplorerDetail() {
  const el = document.getElementById("state-detail");
  if (!el) return;
  const st = explorerState.selected ? stateByCode(explorerState.selected) : null;
  if (!st) {
    el.innerHTML = "<p class=\"muted\">Select a state on the cartogram or in the ranking to see all four indicators for it. Default comparison below is Selangor vs Sabah on poverty.</p>";
    return;
  }
  let html = "<h3>" + st.name + " <span class=\"muted\">" + st.code + " · " + st.group + "</span></h3><table class=\"data\"><tbody>";
  INDICATOR_ORDER.forEach(function (key) {
    const ind = INDICATORS[key];
    html += "<tr><td>" + ind.label + " (" + ind.year + ")</td><td class=\"num\"><strong>" + formatFullValue(key, st[key]) + "</strong></td><td class=\"num muted\">National: " + ind.benchmarkLabel.replace(/^Malaysia: /, "") + "</td></tr>";
  });
  html += "</tbody></table>";
  el.innerHTML = html;
}

function renderExplorerComparison() {
  const aSel = document.getElementById("compare-a");
  const bSel = document.getElementById("compare-b");
  if (!aSel || !bSel) return;
  [aSel, bSel].forEach(function (sel) {
    if (sel.options.length === 0) {
      STATES.forEach(function (s) {
        const o = document.createElement("option");
        o.value = s.code;
        o.textContent = s.name + " (" + s.code + ")";
        sel.appendChild(o);
      });
    }
  });
  aSel.value = explorerState.compareA;
  bSel.value = explorerState.compareB;
  const ind = INDICATORS[explorerState.indicator];
  const a = stateByCode(explorerState.compareA);
  const b = stateByCode(explorerState.compareB);
  const out = document.getElementById("comparison-out");
  if (!out || !a || !b) return;
  const max = Math.max(a[ind.key], b[ind.key], ind.benchmark) * 1.05;
  function barRow(st, color) {
    const w = (st[ind.key] / max * 100).toFixed(1);
    return '<div class="cmp-row"><div class="cmp-label">' + st.name + '</div><div class="cmp-bar" style="width:' + w + '%;background:' + color + '"></div><div class="cmp-val">' + formatFullValue(ind.key, st[ind.key]) + '</div></div>';
  }
  const benchW = (ind.benchmark / max * 100).toFixed(1);
  const diff = (a[ind.key] - b[ind.key]);
  const diffTxt = ind.key === "income"
    ? "RM" + formatInt(Math.abs(diff))
    : Math.abs(diff).toFixed(1) + (ind.format === "percent1" ? " pp" : (ind.format === "thousands" ? "k people" : ""));
  const leader = diff >= 0 ? a : b;
  out.innerHTML = barRow(a, "#3567c0") + barRow(b, "#f3bc65") +
    '<div class="bench"><strong>National benchmark:</strong> ' + ind.benchmarkLabel +
    ' <span class="cmp-bar" style="display:block;width:' + benchW + '%;background:#087f72"></span>' +
    '<p style="margin-top:8px">' + leader.name + ' is higher by ' + diffTxt + ' on ' + ind.label.toLowerCase() + ' (' + ind.year + ').</p></div>';
}

function renderExplorerAll() {
  renderExplorerCartogram();
  renderExplorerRanking();
  renderExplorerDetail();
  renderExplorerComparison();
  const ind = INDICATORS[explorerState.indicator];
  const title = document.getElementById("explorer-title");
  if (title) title.textContent = "State Explorer — " + ind.label + " " + ind.year;
  document.querySelectorAll("[data-indicator-btn]").forEach(function (btn) {
    btn.setAttribute("aria-pressed", btn.getAttribute("data-indicator-btn") === explorerState.indicator ? "true" : "false");
  });
}

function resetExplorer() {
  explorerState.search = "";
  explorerState.group = "all";
  explorerState.sort = "desc";
  explorerState.selected = null;
  explorerState.compareA = "SGR";
  explorerState.compareB = "SBH";
  const s = document.getElementById("state-search");
  if (s) s.value = "";
  const g = document.getElementById("group-filter");
  if (g) g.value = "all";
  const so = document.getElementById("sort-select");
  if (so) so.value = "desc";
  renderExplorerAll();
}

function renderSources() {
  const list = document.getElementById("sources-list");
  if (list) {
    list.innerHTML = SOURCES.map(function (s) {
      return '<li><span class="s-title">' + s.id + ' — ' + s.title + '</span><br><span class="s-meta">' + s.publisher + ' · released ' + s.released + ' · observed ' + s.observed + ' · ' + s.definition + '</span><br><a href="' + s.url + '">' + s.url + '</a></li>';
    }).join("");
  }
  const dlist = document.getElementById("datasets-list");
  if (dlist) {
    dlist.innerHTML = DATASETS.map(function (d) {
      return '<li><span class="s-title">' + d.id + ' — ' + d.indicator + ' (' + d.field + ')</span><br><span class="s-meta">File ' + d.file + ' · filter ' + d.filter + ' · ' + d.unit + ' · catalogue updated ' + d.updated + '</span><br><a href="' + d.csv + '">CSV</a> · <a href="' + d.catalogue + '">Data catalogue</a></li>';
    }).join("");
  }
  const lic = document.getElementById("licence-note");
  if (lic) lic.textContent = LICENCE_NOTE;
}

function initStateExplorer() {
  const params = readParams();
  if (params.indicator && INDICATORS[params.indicator]) explorerState.indicator = params.indicator;
  if (params.sort && ["desc", "asc", "alpha"].indexOf(params.sort) !== -1) explorerState.sort = params.sort;
  if (params.state && stateByCode(params.state)) explorerState.selected = params.state;
  if (params.compareA && stateByCode(params.compareA)) explorerState.compareA = params.compareA;
  if (params.compareB && stateByCode(params.compareB)) explorerState.compareB = params.compareB;
  if (params.group && ["all", "Peninsular", "East Malaysia"].indexOf(params.group) !== -1) explorerState.group = params.group;

  const sortSel = document.getElementById("sort-select");
  if (sortSel) sortSel.value = explorerState.sort;
  const groupSel = document.getElementById("group-filter");
  if (groupSel) groupSel.value = explorerState.group;

  document.querySelectorAll("[data-indicator-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      explorerState.indicator = btn.getAttribute("data-indicator-btn");
      renderExplorerAll();
    });
  });
  const search = document.getElementById("state-search");
  if (search) search.addEventListener("input", function () {
    explorerState.search = search.value;
    renderExplorerAll();
  });
  if (groupSel) groupSel.addEventListener("change", function () {
    explorerState.group = groupSel.value;
    renderExplorerAll();
  });
  if (sortSel) sortSel.addEventListener("change", function () {
    explorerState.sort = sortSel.value;
    renderExplorerAll();
  });
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) resetBtn.addEventListener("click", resetExplorer);
  const csvBtn = document.getElementById("csv-btn");
  if (csvBtn) csvBtn.addEventListener("click", function () {
    const list = explorerSorted(explorerFiltered());
    downloadBlob("selat-atlas-" + explorerState.indicator + ".csv", statesToCsv(list, explorerState.indicator));
  });
  const aSel = document.getElementById("compare-a");
  const bSel = document.getElementById("compare-b");
  if (aSel) aSel.addEventListener("change", function () { explorerState.compareA = aSel.value; renderExplorerComparison(); });
  if (bSel) bSel.addEventListener("change", function () { explorerState.compareB = bSel.value; renderExplorerComparison(); });
  renderSources();
  renderExplorerAll();
}
