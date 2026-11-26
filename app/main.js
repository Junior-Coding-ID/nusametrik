/* NUSAMETRIK — all interactivity. No network: every figure comes from data.js.
   Charts are hand-built SVG strings; controls are theme, language, search,
   filters, sort, compare, CSV download and an indicator picker. */
(function () {
  "use strict";
  var D = window.NUSADATA;
  var doc = document;
  var lang = "en";
  try { lang = localStorage.getItem("nm-lang") || "en"; } catch (e) {}
  function L(en, id) { return lang === "id" ? id : en; }
  function $(s, r) { return (r || doc).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function fmt(n, d) {
    return n.toLocaleString("en-US", { minimumFractionDigits: d == null ? 0 : d, maximumFractionDigits: d == null ? 0 : d });
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function provName(p) { return lang === "id" ? p.id : p.en; }
  function macroOf(p) {
    var g = D.macroGroups;
    for (var i = 0; i < g.length; i++) if (g[i].islands.indexOf(p.island) >= 0) return g[i].id;
    return "East";
  }

  /* ---------- theme + language + mobile menu ---------- */
  var root = doc.documentElement;
  var theme = "light";
  try { theme = localStorage.getItem("nm-theme") || "light"; } catch (e) {}
  root.setAttribute("data-theme", theme);
  function applyLang() {
    root.setAttribute("lang", lang);
    $all("[data-en]").forEach(function (el) {
      el.textContent = lang === "id" ? el.getAttribute("data-id") : el.getAttribute("data-en");
    });
    var lb = $("#langBtn"); if (lb) lb.textContent = lang === "id" ? "EN" : "ID";
    var tb = $("#themeBtn"); if (tb) tb.textContent = theme === "dark" ? "☀ Light" : "☾ Dark";
  }
  function bindChrome() {
    var tb = $("#themeBtn");
    if (tb) tb.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      try { localStorage.setItem("nm-theme", theme); } catch (e) {}
      applyLang(); renderPage();
    });
    var lb = $("#langBtn");
    if (lb) lb.addEventListener("click", function () {
      lang = lang === "id" ? "en" : "id";
      try { localStorage.setItem("nm-lang", lang); } catch (e) {}
      applyLang(); renderPage();
    });
    var mb = $("#menuBtn");
    if (mb) mb.addEventListener("click", function () {
      var nav = $("#mainNav"); if (nav) nav.classList.toggle("open");
      mb.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }

  /* ---------- SVG chart builders ---------- */
  function svgOpen(w, h, title) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h +
      '" role="img" aria-label="' + esc(title) + '"><title>' + esc(title) + "</title>";
  }
  function niceMax(v) { var p = Math.pow(10, Math.floor(Math.log10(v))); return Math.ceil(v / p) * p; }

  /* Diverging vertical bars (handles the negative 2020 GDP bar). */
  function vbar(el, rows, opts) {
    var W = 640, H = 300, padL = 44, padB = 30, padT = 30;
    var vals = rows.map(function (r) { return r.value; });
    var lo = Math.min(0, Math.min.apply(null, vals));
    var hi = Math.max.apply(null, vals);
    var span = hi - lo || 1;
    var plotH = H - padT - padB, plotW = W - padL - 12;
    var y0 = padT + (hi / span) * plotH;
    var bw = Math.min(64, plotW / rows.length * 0.62);
    var step = plotW / rows.length;
    var s = svgOpen(W, H, opts.title);
    s += '<line x1="' + padL + '" y1="' + y0 + '" x2="' + (W - 12) + '" y2="' + y0 + '" stroke="#53676d" stroke-width="1"/>';
    rows.forEach(function (r, i) {
      var cx = padL + step * i + step / 2;
      var y = padT + ((hi - r.value) / span) * plotH;
      var h = Math.abs(y0 - y);
      var col = r.value < 0 ? "#d85d49" : (r.extra ? "#e7ac57" : "#0d766e");
      s += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + Math.min(y, y0).toFixed(1) +
        '" width="' + bw + '" height="' + Math.max(h, 2).toFixed(1) + '" fill="' + col + '" rx="3"><title>' +
        esc(r.label) + ": " + r.value + "%</title></rect>";
      if (r.value < 0) {
        s += '<text class="bar-label" x="' + cx + '" y="' + (y0 + h - 8).toFixed(1) +
          '" text-anchor="middle" fill="#ffffff">' + r.value.toFixed(2) + "%</text>";
      } else {
        s += '<text class="bar-label" x="' + cx + '" y="' + (y - 7).toFixed(1) +
          '" text-anchor="middle">' + r.value.toFixed(2) + "%</text>";
      }
      s += '<text class="axis-label" x="' + cx + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(r.label) + "</text>";
    });
    if (opts.note) s += '<text class="axis-note" x="' + padL + '" y="14">' + esc(opts.note) + "</text>";
    el.innerHTML = s + "</svg>";
  }

  /* Multi-series line chart with dots + value labels. */
  function lineChart(el, series, labels, opts) {
    var W = 640, H = 300, padL = 46, padB = 30, padT = 34;
    var all = []; series.forEach(function (s) { all = all.concat(s.values); });
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
    var pad = (hi - lo) * 0.15 || 1; lo -= pad; hi += pad;
    var plotW = W - padL - 14, plotH = H - padT - padB;
    function X(i) { return padL + (plotW * i) / (labels.length - 1); }
    function Y(v) { return padT + ((hi - v) / (hi - lo)) * plotH; }
    var s = svgOpen(W, H, opts.title);
    [0.25, 0.5, 0.75].forEach(function (f) {
      var y = padT + plotH * f;
      s += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - 14) + '" y2="' + y + '" stroke="#dce4e0" stroke-width="1"/>';
    });
    series.forEach(function (sr) {
      var pts = sr.values.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" ");
      s += '<polyline points="' + pts + '" fill="none" stroke="' + sr.color + '" stroke-width="3" stroke-linejoin="round"/>';
      sr.values.forEach(function (v, i) {
        s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4.5" fill="' + sr.color + '"><title>' +
          esc(labels[i]) + " — " + sr.name + ": " + v.toFixed(2) + "%</title></circle>";
        if (opts.labels) s += '<text class="bar-label" x="' + X(i).toFixed(1) + '" y="' + (Y(v) - 9).toFixed(1) +
          '" text-anchor="middle">' + v.toFixed(2) + "</text>";
      });
    });
    labels.forEach(function (lb, i) {
      s += '<text class="axis-label" x="' + X(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(lb) + "</text>";
    });
    if (opts.note) s += '<text class="axis-note" x="' + padL + '" y="14">' + esc(opts.note) + "</text>";
    el.innerHTML = s + "</svg>";
  }

  /* Horizontal bars, ranked. */
  function hbar(el, rows, opts) {
    var W = 640, rowH = 34, padL = 150, padR = 70, padT = 8;
    var H = padT + rows.length * rowH + 8;
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }));
    var s = svgOpen(W, H, opts.title);
    rows.forEach(function (r, i) {
      var y = padT + i * rowH, bw = (W - padL - padR) * (r.value / max);
      s += '<text class="axis-label" x="' + (padL - 8) + '" y="' + (y + 19) + '" text-anchor="end">' + esc(r.label) + "</text>";
      s += '<rect x="' + padL + '" y="' + (y + 6) + '" width="' + Math.max(bw, 2).toFixed(1) + '" height="20" rx="3" fill="' +
        (i === 0 ? "#e7ac57" : "#0d766e") + '"><title>' + esc(r.label) + ": " + fmt(r.value) + "</title></rect>";
      s += '<text class="bar-label" x="' + (padL + bw + 6).toFixed(1) + '" y="' + (y + 21) + '">' + fmt(r.value) + "</text>";
    });
    el.innerHTML = s + "</svg>";
  }

  /* Dumbbell: two dots joined by a line, one row per year. */
  function dumbbell(el, rows, opts) {
    var W = 640, rowH = 56, padL = 70, padR = 60, padT = 10;
    var H = padT + rows.length * rowH + 26;
    var s = svgOpen(W, H, opts.title);
    s += '<text class="axis-note" x="' + padL + '" y="' + (H - 6) + '">' + esc(opts.xnote || "") + "</text>";
    rows.forEach(function (r, i) {
      var y = padT + i * rowH + 22;
      var x1 = padL + (W - padL - padR) * (r.a / 100), x2 = padL + (W - padL - padR) * (r.b / 100);
      s += '<text class="axis-label" x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + esc(r.label) + "</text>";
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + y + '" x2="' + x2.toFixed(1) + '" y2="' + y + '" stroke="#53676d" stroke-width="3"/>';
      s += '<circle cx="' + x1.toFixed(1) + '" cy="' + y + '" r="8" fill="#0d766e"><title>' + esc(r.label) + " urban: " + r.a + '%</title></circle>';
      s += '<circle cx="' + x2.toFixed(1) + '" cy="' + y + '" r="8" fill="#d85d49"><title>' + esc(r.label) + " rural: " + r.b + '%</title></circle>';
      s += '<text class="bar-label" x="' + (x1 - 12).toFixed(1) + '" y="' + (y + 4) + '" text-anchor="end">' + r.a.toFixed(2) + "%</text>";
      s += '<text class="bar-label" x="' + (x2 + 12).toFixed(1) + '" y="' + (y + 4) + '">' + r.b.toFixed(2) + "%</text>";
    });
    el.innerHTML = s + "</svg>";
  }

  /* Lollipop: dot on a stem, one per year. */
  function lollipop(el, rows, opts) {
    var W = 640, H = 280, padL = 46, padB = 30, padT = 30;
    var vals = rows.map(function (r) { return r.value; });
    var lo = Math.min.apply(null, vals) - 1.5, hi = Math.max.apply(null, vals) + 0.8;
    var plotW = W - padL - 14, plotH = H - padT - padB;
    function X(i) { return padL + (plotW * i) / (rows.length - 1); }
    function Y(v) { return padT + ((hi - v) / (hi - lo)) * plotH; }
    var s = svgOpen(W, H, opts.title);
    s += '<line x1="' + padL + '" y1="' + Y(lo) + '" x2="' + (W - 14) + '" y2="' + Y(lo) + '" stroke="#53676d" stroke-width="1"/>';
    rows.forEach(function (r, i) {
      s += '<line x1="' + X(i).toFixed(1) + '" y1="' + Y(lo).toFixed(1) + '" x2="' + X(i).toFixed(1) + '" y2="' + Y(r.value).toFixed(1) + '" stroke="#0d766e" stroke-width="3"/>';
      s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(r.value).toFixed(1) + '" r="8" fill="#e7ac57" stroke="#102e35" stroke-width="1.5"><title>' +
        r.label + ": " + r.value.toFixed(2) + "</title></circle>";
      s += '<text class="bar-label" x="' + X(i).toFixed(1) + '" y="' + (Y(r.value) - 13).toFixed(1) + '" text-anchor="middle">' + r.value.toFixed(2) + "</text>";
      s += '<text class="axis-label" x="' + X(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(r.label) + "</text>";
    });
    el.innerHTML = s + "</svg>";
  }

  /* ---------- page renderers ---------- */
  function renderIndex() {
    var g = $("#chartGdp"); if (!g) return;
    var rows = D.gdpGrowthFY.map(function (r) { return { label: String(r.year), value: r.value }; });
    rows.push({ label: D.gdpLatest.label_en, value: D.gdpLatest.value, extra: true });
    vbar(g, rows, { title: "Real GDP growth, percent", note: L("Full-year 2020–2024 + Q3 2025 (yoy, amber)", "Tahunan 2020–2024 + Kuartal III 2025 (yoy, kuning)") });
    var inf = $("#chartInflUnemp");
    if (inf) lineChart(inf, [
      { name: "Inflation", color: "#d85d49", values: D.inflationDec.map(function (r) { return r.value; }).concat([D.inflationLatest.value]) },
      { name: "Unemployment", color: "#0d766e", values: D.unemployment.map(function (r) { return r.value; }) }
    ], ["2020", "2021", "2022", "2023", "2024", L("Oct 2025", "Okt 2025")],
      { title: "Inflation and unemployment, percent", labels: false,
        note: L("Inflation: December yoy (Oct 2025 latest) · Unemployment: August", "Inflasi: Desember yoy (Okt 2025 terbaru) · Pengangguran: Agustus") });
    var top = $("#chartTopProv");
    if (top) {
      var t10 = D.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 10)
        .map(function (p) { return { label: provName(p), value: p.pop }; });
      hbar(top, t10, { title: "Largest provinces by population, mid-2025" });
    }
  }

  function renderEconomy() {
    var pick = $("#indicatorPick");
    var box = $("#chartPicker");
    function draw() {
      if (!box) return;
      var v = pick ? pick.value : "gdp";
      if (v === "gdp") {
        var rows = D.gdpGrowthFY.map(function (r) { return { label: String(r.year), value: r.value }; });
        rows.push({ label: D.gdpLatest.label_en, value: D.gdpLatest.value, extra: true });
        vbar(box, rows, { title: "Real GDP growth, percent", note: L("Full-year 2020–2024 + Q3 2025 (yoy)", "Tahunan 2020–2024 + Kuartal III 2025 (yoy)") });
      } else if (v === "inflation") {
        lineChart(box, [{ name: "Inflation", color: "#d85d49",
          values: D.inflationMonthly2025.map(function (r) { return r.value; }) }],
          D.inflationMonthly2025.map(function (r) { return r.m; }),
          { title: "Monthly inflation 2025, yoy percent", labels: true,
            note: L("January–October 2025, year-on-year", "Januari–Oktober 2025, year-on-year") });
      } else {
        lineChart(box, [{ name: "Unemployment", color: "#0d766e",
          values: D.unemployment.map(function (r) { return r.value; }) }],
          D.unemployment.map(function (r) { return String(r.year); }),
          { title: "Open unemployment rate, August, percent", labels: true, note: "" });
      }
    }
    if (pick) pick.addEventListener("change", draw);
    draw();
    var tr = $("#chartTrade");
    if (tr) hbar(tr, D.trade.destinations.map(function (d) {
      return { label: L(d.name_en, d.name_id), value: d.value * 1e9 };
    }), { title: "Top export destinations, Jan–Oct 2025, US$" });
  }

  function renderPeople() {
    var ip = $("#chartIpm");
    if (ip) lollipop(ip, D.ipm.map(function (r) { return { label: String(r.year), value: r.value }; }),
      { title: "Human Development Index (IPM), 2020–2024" });
    var pv = $("#chartPoverty");
    if (pv) vbar(pv, D.poverty.map(function (r) { return { label: r.label, value: r.value }; }),
      { title: "Poverty rate, percent", note: L("BPS, March and September releases", "BPS, rilis Maret dan September") });
    var isl = $("#chartIslands");
    if (isl) {
      var sums = {};
      D.provinces.forEach(function (p) { sums[p.island] = (sums[p.island] || 0) + p.pop; });
      var order = ["Java", "Sumatra", "Sulawesi", "Kalimantan", "Nusa Tenggara", "Papua", "Maluku"];
      hbar(isl, order.map(function (k) { return { label: k, value: sums[k] || 0 }; }),
        { title: "Population by island group, mid-2025" });
    }
  }

  function renderConnectivity() {
    var it = $("#chartInternet");
    if (it) lineChart(it, [{ name: "Internet users", color: "#0d766e",
      values: D.internet.map(function (r) { return r.value; }) }],
      D.internet.map(function (r) { return String(r.year); }),
      { title: "People using the internet, percent of population 5+", labels: true, note: "" });
    var db = $("#chartDumbbell");
    if (db) dumbbell(db, [
      { label: "2025", a: D.internetSplit.urban, b: D.internetSplit.rural },
      { label: "2024", a: D.internetSplit.urban2024, b: D.internetSplit.rural2024 }
    ], { title: "Internet use: urban vs rural, percent", xnote: L("Teal = urban · terracotta = rural", "Teal = perkotaan · terakota = perdesaan") });
  }

  /* ---------- Province Explorer ---------- */
  var ex = { q: "", macro: "All", sort: "pop-desc" };
  function filteredProvinces() {
    var list = D.provinces.filter(function (p) {
      if (ex.macro !== "All" && macroOf(p) !== ex.macro) return false;
      if (ex.q) {
        var q = ex.q.toLowerCase();
        if ((p.en + " " + p.id + " " + p.capital).toLowerCase().indexOf(q) < 0) return false;
      }
      return true;
    });
    var key = ex.sort;
    list.sort(function (a, b) {
      if (key === "pop-desc") return b.pop - a.pop;
      if (key === "pop-asc") return a.pop - b.pop;
      if (key === "density-desc") return b.density - a.density;
      if (key === "area-desc") return b.area - a.area;
      return provName(a).localeCompare(provName(b));
    });
    return list;
  }
  function renderExplorer() {
    var tiles = $("#tiles"); if (!tiles) return;
    var list = filteredProvinces();
    var html = "";
    D.macroGroups.forEach(function (g) {
      var inGroup = list.filter(function (p) { return macroOf(p) === g.id; });
      if (!inGroup.length) return;
      html += '<div class="tile-group">' + esc(L(g.en, g.id_id)) + " · " + inGroup.length + "</div>";
      inGroup.forEach(function (p) {
        html += '<button type="button" class="tile" data-code="' + p.code + '"><b>' + esc(provName(p)) +
          "</b><span>" + fmt(p.pop) + " · " + fmt(p.density) + "/km²</span></button>";
      });
    });
    tiles.innerHTML = html || '<p class="muted">' + esc(L("No province matches your search.", "Tidak ada provinsi yang cocok.")) + "</p>";
    $all(".tile", tiles).forEach(function (t) {
      t.addEventListener("click", function () {
        var p = D.provinces.filter(function (x) { return x.code === t.getAttribute("data-code"); })[0];
        if (p) showProvince(p, true);
      });
    });
    var tb = $("#provTable tbody");
    if (tb) {
      tb.innerHTML = list.map(function (p, i) {
        return "<tr" + (i < 3 ? ' class="top"' : "") + "><td>" + (i + 1) + "</td><td>" + esc(provName(p)) +
          "</td><td>" + esc(p.capital) + "</td><td>" + esc(p.island) + '</td><td class="num">' + fmt(p.pop) +
          '</td><td class="num">' + fmt(p.area, 2) + '</td><td class="num">' + fmt(p.density) + "</td></tr>";
      }).join("");
    }
    var count = $("#provCount");
    if (count) count.textContent = L(list.length + " of 38 provinces", list.length + " dari 38 provinsi");
  }
  function showProvince(p, scroll) {
    var box = $("#provDetail");
    if (!box) return;
    box.innerHTML = "<h3>" + esc(provName(p)) + " <small>· " + esc(p.code) + "</small></h3>" +
      "<p>" + esc(L("Capital", "Ibu kota")) + ": <b>" + esc(p.capital) + "</b> · " + esc(p.island) + "</p>" +
      '<table class="data"><tbody>' +
      "<tr><td>" + esc(L("Population (mid-2025)", "Penduduk (pertengahan 2025)")) + '</td><td class="num"><b>' + fmt(p.pop) + "</b></td></tr>" +
      "<tr><td>" + esc(L("Share of Indonesia", "Pangsa terhadap Indonesia")) + '</td><td class="num">' + (100 * p.pop / 284438800).toFixed(2) + "%</td></tr>" +
      "<tr><td>" + esc(L("Land area", "Luas daratan")) + '</td><td class="num">' + fmt(p.area, 2) + " km²</td></tr>" +
      "<tr><td>" + esc(L("Density", "Kepadatan")) + '</td><td class="num">' + fmt(p.density) + " /km²</td></tr>" +
      "</tbody></table>";
    if (scroll) box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function renderCompare() {
    var a = $("#cmpA"), b = $("#cmpB"), out = $("#cmpOut");
    if (!a || !b || !out) return;
    function fill(sel, selected) {
      sel.innerHTML = D.provinces.slice().sort(function (x, y) { return y.pop - x.pop; })
        .map(function (p) { return '<option value="' + p.code + '"' + (p.code === selected ? " selected" : "") + ">" + esc(provName(p)) + "</option>"; }).join("");
    }
    if (!a.options.length) { fill(a, "32"); fill(b, "35"); }
    function draw() {
      var pa = D.provinces.filter(function (x) { return x.code === a.value; })[0];
      var pb = D.provinces.filter(function (x) { return x.code === b.value; })[0];
      if (!pa || !pb) return;
      function row(label, va, vb, unit) {
        return "<tr><td>" + esc(label) + '</td><td class="num">' + va + '</td><td class="num">' + vb + "</td></tr>";
      }
      out.innerHTML = '<table class="data"><thead><tr><th></th><th>' + esc(provName(pa)) + "</th><th>" + esc(provName(pb)) + "</th></tr></thead><tbody>" +
        row(L("Population", "Penduduk"), fmt(pa.pop), fmt(pb.pop)) +
        row(L("Land area (km²)", "Luas (km²)"), fmt(pa.area, 2), fmt(pb.area, 2)) +
        row(L("Density (/km²)", "Kepadatan (/km²)"), fmt(pa.density), fmt(pb.density)) +
        row(L("Capital", "Ibu kota"), esc(pa.capital), esc(pb.capital)) +
        "</tbody></table>";
    }
    a.addEventListener("change", draw); b.addEventListener("change", draw); draw();
  }
  function downloadCsv() {
    var list = filteredProvinces();
    var head = "code,province_en,province_id,capital,island_group,population_mid2025,area_km2,density_per_km2\n";
    var body = list.map(function (p) {
      return [p.code, '"' + p.en + '"', '"' + p.id + '"', '"' + p.capital + '"', p.island, p.pop, p.area, p.density].join(",");
    }).join("\n");
    var blob = new Blob([head + body + "\n"], { type: "text/csv;charset=utf-8" });
    var a = doc.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nusametrik-provinces-mid2025.csv";
    doc.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function bindExplorer() {
    var q = $("#provSearch");
    if (q) q.addEventListener("input", function () { ex.q = q.value; renderExplorer(); });
    var mf = $("#macroFilter");
    if (mf) mf.addEventListener("change", function () { ex.macro = mf.value; renderExplorer(); });
    var st = $("#sortPick");
    if (st) st.addEventListener("change", function () { ex.sort = st.value; renderExplorer(); });
    var dl = $("#csvBtn");
    if (dl) dl.addEventListener("click", downloadCsv);
    var dflt = D.provinces.filter(function (p) { return p.code === "32"; })[0];
    if (dflt) showProvince(dflt);
    renderCompare();
  }

  /* ---------- dispatch ---------- */
  function renderPage() {
    var page = doc.body.getAttribute("data-page");
    if (page === "index") renderIndex();
    else if (page === "economy") renderEconomy();
    else if (page === "people") renderPeople();
    else if (page === "connectivity") renderConnectivity();
    else if (page === "provinces") { renderExplorer(); renderCompare(); }
  }
  bindChrome();
  applyLang();
  renderPage();
  if (doc.body.getAttribute("data-page") === "provinces") bindExplorer();
})();
