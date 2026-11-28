/* SELAT ATLAS — core: navigation, number formatting, CSV download, page boot.
   Classic script, no modules, no network. Runs on file:// too. */
function formatInt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDecimal(n, places) {
  return n.toFixed(places);
}

function formatValue(key, value) {
  const ind = INDICATORS[key];
  if (!ind) return String(value);
  if (ind.format === "thousands") return formatInt(value) + "k";
  if (ind.format === "percent1") return formatDecimal(value, 1) + "%";
  if (ind.format === "rm") return "RM" + formatInt(value);
  return String(value);
}

function formatFullValue(key, value) {
  const ind = INDICATORS[key];
  if (!ind) return String(value);
  if (ind.format === "thousands") return formatInt(value) + ",000 people";
  if (ind.format === "percent1") return formatDecimal(value, 1) + "%";
  if (ind.format === "rm") return "RM" + formatInt(value) + " / month";
  return String(value);
}

function downloadBlob(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 500);
}

function rowsToCsv(rows) {
  return rows.map(function (row) {
    return row.map(function (cell) {
      const s = String(cell == null ? "" : cell);
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(",");
  }).join("\n") + "\n";
}

function statesToCsv(list, indicatorKey) {
  const ind = INDICATORS[indicatorKey];
  const rows = [["code", "state", "group", ind.key + "_" + ind.year, "unit"]];
  list.forEach(function (s) {
    rows.push([s.code, s.name, s.group, s[ind.key], ind.unit]);
  });
  return rowsToCsv(rows);
}

function initNav() {
  const btn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".mainnav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function readParams() {
  const out = {};
  const q = window.location.search.replace(/^\?/, "");
  if (!q) return out;
  q.split("&").forEach(function (pair) {
    const parts = pair.split("=");
    if (parts.length === 2) out[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  });
  return out;
}

function initOverview() {
  renderDivergingBars(document.getElementById("chart-gdp"), GDP_SERIES);
  renderMiniCartogram(document.getElementById("mini-cartogram"), "population");
  const insights = document.getElementById("insights");
  if (insights) {
    const total = stateTotalPopulation();
    let top = STATES[0];
    STATES.forEach(function (s) { if (s.population > top.population) top = s; });
    const share = (top.population / total * 100).toFixed(1);
    let worst = STATES[0];
    STATES.forEach(function (s) { if (s.poverty > worst.poverty) worst = s; });
    const ratio = (worst.poverty / NATIONAL.poverty.value).toFixed(1);
    const held = GDP_SERIES[4].growth === GDP_SERIES[5].growth ? "held at " + GDP_SERIES[5].growth.toFixed(1) + "%" : "moved to " + GDP_SERIES[5].growth.toFixed(1) + "%";
    insights.innerHTML =
      "<p class=\"insight\"><strong>Growth held steady.</strong> Real GDP growth " + held +
      " in both 2024 and 2025 — the steadiest two-year run since the 9.0% rebound of 2022.</p>" +
      "<p class=\"insight\"><strong>One state in five lives in Selangor.</strong> " + top.name + " holds " +
      formatDecimal(top.population / 1000, 2) + " million people — " + share + "% of Malaysia's " +
      formatDecimal(total / 1000, 2) + " million.</p>" +
      "<p class=\"insight\"><strong>The poverty gap is wide.</strong> " + worst.name + "'s poverty rate of " +
      formatDecimal(worst.poverty, 1) + "% is " + ratio + "× the national " +
      formatDecimal(NATIONAL.poverty.value, 1) + "% — the largest gap of any state. Open the State Explorer to compare all sixteen.</p>";
  }
}

function initEconomy() {
  renderSectorBars(document.getElementById("chart-sectors"), SECTORS_2025, NATIONAL.gdpGrowth.value);
  renderPairedBars(document.getElementById("chart-inflation"),
    [{ label: "2024", value: NATIONAL.inflation.previous.value }, { label: "2025", value: NATIONAL.inflation.value }],
    { unit: "%", title: "Annual inflation" });
  renderPairedBars(document.getElementById("chart-unemployment"),
    [{ label: "2024", value: NATIONAL.unemployment.previous.value }, { label: "2025", value: NATIONAL.unemployment.value }],
    { unit: "%", title: "Unemployment rate" });
  renderStackedBar(document.getElementById("chart-mix"),
    [{ label: "Services + manufacturing", value: NATIONAL.gdpShareServicesManufacturing.value, color: "#3567c0" },
     { label: "All other sectors", value: 100 - NATIONAL.gdpShareServicesManufacturing.value, color: "#85b3e4" }]);
}

function initPeople() {
  renderSlopeChart(document.getElementById("chart-poverty-slope"),
    [{ label: "2022", value: NATIONAL.poverty.previous.value }, { label: "2024", value: NATIONAL.poverty.value }],
    { unit: "%", title: "Absolute household poverty", goodDown: true });
  renderSlopeChart(document.getElementById("chart-gini-slope"),
    [{ label: "2022", value: NATIONAL.gini.previous.value }, { label: "2024", value: NATIONAL.gini.value }],
    { unit: "", title: "Gini coefficient", decimals: 3, goodDown: true });
  renderDumbbell(document.getElementById("chart-internet-dumbbell"),
    { aLabel: "Urban", a: NATIONAL.internetUrban.value, bLabel: "Rural", b: NATIONAL.internetRural.value },
    { unit: "%", gap: 8.3 });
  renderHorizontalBars(document.getElementById("chart-electricity"),
    [{ label: "National", value: NATIONAL.electricity.value },
     { label: "Urban", value: NATIONAL.electricity.urban },
     { label: "Rural", value: NATIONAL.electricity.rural }],
    { unit: "%", max: 100 });
}

function bootPage() {
  initNav();
  const page = document.body.getAttribute("data-page");
  if (page === "overview") initOverview();
  else if (page === "economy") initEconomy();
  else if (page === "people") initPeople();
  else if (page === "states") initStateExplorer();
}

document.addEventListener("DOMContentLoaded", bootPage);
