/* NUSAMETRIK — Indonesia in Numbers. Single source of truth for every figure
   on this site. Every number below was published by an official source on or
   before 26 November 2026; each entry names its period and source. Figures
   whose full-year 2025 release did not exist yet on that date are NOT used:
   the site shows the latest published value instead, with its true period.
   See sources.html for the full audit table. */
var NUSADATA = {
  meta: {
    brand: "NUSAMETRIK",
    tagline_en: "Indonesia in Numbers",
    tagline_id: "Indonesia dalam Angka",
    motto_en: "One country. Thousands of stories in data.",
    motto_id: "Satu negara. Ribuan cerita dalam data.",
    edition_en: "2025 Annual Edition",
    edition_id: "Edisi Tahunan 2025",
    cutoff_en: "Figures as published by 26 November 2026",
    cutoff_id: "Angka sesuai rilis resmi hingga 26 November 2026",
    country_en: "Indonesia",
    landAreaKm2: 1890179.8,
    provinces: 38,
    islands_en: "17,000+ islands",
    islands_id: "17.000+ pulau"
  },

  /* Homepage KPIs — latest published value for each indicator. */
  kpis: [
    { id: "pop", value: "284.44m", label_en: "Population", label_id: "Penduduk",
      sub_en: "Mid-2025 estimate · BPS", sub_id: "Estimasi pertengahan 2025 · BPS",
      note_en: "Java holds 55.6% of all Indonesians.", note_id: "Jawa menampung 55,6% penduduk." },
    { id: "gdp", value: "Rp22,139T", label_en: "Nominal GDP", label_id: "PDB nominal",
      sub_en: "2024 · BPS — US$1.40T", sub_id: "2024 · BPS — US$1,40T",
      note_en: "Rp78.62m per person in 2024.", note_id: "Rp78,62 jt per kapita pada 2024." },
    { id: "growth", value: "5.04%", label_en: "GDP growth", label_id: "Pertumbuhan PDB",
      sub_en: "Q3 2025, year-on-year · BPS", sub_id: "Kuartal III 2025, y-on-y · BPS",
      note_en: "Jan–Sep 2025 cumulative: 5.01%.", note_id: "Kumulatif Jan–Sep 2025: 5,01%." },
    { id: "inflation", value: "2.86%", label_en: "Inflation", label_id: "Inflasi",
      sub_en: "October 2025, year-on-year · BPS", sub_id: "Oktober 2025, y-on-y · BPS",
      note_en: "Inside Bank Indonesia's 2.5% ± 1% target.", note_id: "Dalam sasaran BI 2,5% ± 1%." },
    { id: "unemp", value: "4.85%", label_en: "Unemployment", label_id: "Pengangguran",
      sub_en: "August 2025 · BPS Sakernas", sub_id: "Agustus 2025 · BPS Sakernas",
      note_en: "7.46 million people out of work.", note_id: "7,46 juta orang menganggur." },
    { id: "poverty", value: "8.47%", label_en: "Poverty rate", label_id: "Tingkat kemiskinan",
      sub_en: "March 2025 · BPS", sub_id: "Maret 2025 · BPS",
      note_en: "23.85 million people below the line.", note_id: "23,85 juta jiwa di bawah garis." }
  ],

  insights: [
    { title_en: "66 straight months of trade surplus",
      title_id: "Surplus dagang 66 bulan beruntun",
      body_en: "Exports reached US$234.04bn in Jan–Oct 2025 (+6.96% yoy) against US$198.16bn of imports — a US$35.88bn surplus, the longest streak since May 2020. China, the US and India took 41.8% of non-oil exports.",
      body_id: "Ekspor mencapai US$234,04 miliar pada Jan–Okt 2025 (+6,96% yoy) berbanding impor US$198,16 miliar — surplus US$35,88 miliar, rekor beruntun terpanjang sejak Mei 2020. Tiongkok, AS, dan India menyerap 41,8% ekspor nonmigas." },
    { title_en: "Human development keeps climbing",
      title_id: "Pembangunan manusia terus menanjak",
      body_en: "The Human Development Index (IPM) reached 75.02 in 2024, up 0.63 points on 2023 — the fifth straight annual rise. Life expectancy hit 74.15 years, but the gap is wide: DKI Jakarta scores 83.08 while Highland Papua scores 53.42.",
      body_id: "Indeks Pembangunan Manusia (IPM) mencapai 75,02 pada 2024, naik 0,63 poin dari 2023 — kenaikan tahunan kelima beruntun. Harapan hidup mencapai 74,15 tahun, tetapi kesenjangannya lebar: DKI Jakarta 83,08 sementara Papua Pegunungan 53,42." }
  ],

  /* Full-year real GDP growth (%), BPS. 2025 full-year was not published yet. */
  gdpGrowthFY: [
    { year: 2020, value: -2.07 }, { year: 2021, value: 3.70 },
    { year: 2022, value: 5.31 }, { year: 2023, value: 5.05 },
    { year: 2024, value: 5.03 }
  ],
  gdpLatest: { label_en: "Q3 2025 (yoy)", label_id: "Kuartal III 2025 (yoy)", value: 5.04,
    cum_en: "Jan–Sep 2025 cumulative: 5.01%", cum_id: "Kumulatif Jan–Sep 2025: 5,01%",
    nominalQ3_en: "Q3 2025 nominal GDP: Rp6,060.0 trillion",
    nominalQ3_id: "PDB nominal Kuartal III 2025: Rp6.060,0 triliun" },
  gdpNominal: [
    { year: 2023, rp: 20892.4, usd: 1371.2 }, { year: 2024, rp: 22138.96, usd: 1396.3 }
  ],
  gdpPerCapita: { year: 2024, rpM: 78.62, usd: 4960.33 },

  /* December CPI inflation (yoy %), BPS; latest point is October 2025. */
  inflationDec: [
    { year: 2020, value: 1.68 }, { year: 2021, value: 1.87 },
    { year: 2022, value: 5.51 }, { year: 2023, value: 2.61 },
    { year: 2024, value: 1.57 }
  ],
  inflationLatest: { label_en: "Oct 2025 (yoy)", label_id: "Okt 2025 (yoy)", value: 2.86,
    core_en: "Core 2.36% · volatile food 6.59% · administered prices 1.45%",
    core_id: "Inti 2,36% · volatile food 6,59% · harga diatur 1,45%" },
  inflationMonthly2025: [
    { m: "Jan", value: 0.76 }, { m: "Feb", value: -0.09 }, { m: "Mar", value: 1.03 },
    { m: "Apr", value: 1.95 }, { m: "May", value: 1.60 }, { m: "Jun", value: 1.87 },
    { m: "Jul", value: 2.37 }, { m: "Aug", value: 2.31 }, { m: "Sep", value: 2.65 },
    { m: "Oct", value: 2.86 }
  ],

  /* Open unemployment rate, August (%), BPS Sakernas. */
  unemployment: [
    { year: 2020, value: 7.07 }, { year: 2021, value: 6.49 },
    { year: 2022, value: 5.86 }, { year: 2023, value: 5.32 },
    { year: 2024, value: 4.91 }, { year: 2025, value: 4.85 }
  ],
  jobs: { unemployedM: 7.46, feb2025: 4.76, youth1524: 16.9, partTime: 24.77,
    underemployed: 7.91, wageRpM: 3.33,
    wageNote_en: "Average monthly wage of employees, Aug 2025",
    wageNote_id: "Rata-rata upah bulanan buruh/karyawan, Agu 2025" },

  /* Poverty rate (%), BPS. March and September releases. */
  poverty: [
    { label: "Mar 2024", value: 9.03 }, { label: "Sep 2024", value: 8.57 },
    { label: "Mar 2025", value: 8.47 }
  ],
  povertyDetail: { poorM: 23.85, urban: 6.73, rural: 11.03, extreme: 0.85,
    lineRp: 609160,
    lineNote_en: "Poverty line, Mar 2025: Rp609,160 per capita/month",
    lineNote_id: "Garis kemiskinan, Mar 2025: Rp609.160 per kapita/bulan" },

  /* Human Development Index (IPM), BPS. 2015–2019 use the pre-revision series
     and are not shown: this chart shows the verified 2020–2024 series only. */
  ipm: [
    { year: 2020, value: 72.81 }, { year: 2021, value: 73.16 },
    { year: 2022, value: 73.77 }, { year: 2023, value: 74.39 },
    { year: 2024, value: 75.02 }
  ],
  ipmDetail: { lifeExpectancy: 74.15, schoolingExpected: 13.21, schoolingMean: 8.85,
    top_en: "Highest: DKI Jakarta 83.08 · DI Yogyakarta 81.55 · East Kalimantan 78.83",
    top_id: "Tertinggi: DKI Jakarta 83,08 · DI Yogyakarta 81,55 · Kalimantan Timur 78,83",
    low_en: "Lowest: Highland Papua 53.42 · Central Papua 59.75",
    low_id: "Terendah: Papua Pegunungan 53,42 · Papua Tengah 59,75",
    undp: 0.728, undpRank: "114 of 193", undpYear: 2023 },

  /* People: verified national indicators. */
  people: { literacy: 98.15, literacyYear: 2023, literacyNote_en: "Aged 15+, 2023",
    literacyNote_id: "Usia 15+, 2023",
    electricity: 99.4, electricityYear: 2023,
    forest: 50.59, forestYear: 2023, co2: 2.5, co2Year: 2021,
    density: 150, densityNote_en: "per km², mid-2025 (computed)",
    densityNote_id: "per km², pertengahan 2025 (dihitung)" },

  /* Internet access, % of population aged 5+ (BPS, Susenas / Statistik Telekomunikasi). */
  internet: [
    { year: 2021, value: 62.10 }, { year: 2022, value: 66.48 },
    { year: 2023, value: 69.21 }, { year: 2024, value: 72.78 },
    { year: 2025, value: 77.63 }
  ],
  internetSplit: { year: 2025, urban: 82.72, rural: 70.14,
    urban2024: 79.13, rural2024: 63.71,
    mobile: 99.08, mobileYear: 2024,
    mobileNote_en: "of internet users go online by mobile phone (2024)",
    mobileNote_id: "pengguna internet mengakses lewat ponsel (2024)" },

  /* Trade, January–October 2025 (BPS BRS, 1 Dec 2025). US$ billion. */
  trade: { period_en: "January–October 2025", period_id: "Januari–Oktober 2025",
    exports: 234.04, exportsGrowth: 6.96, nonOilExports: 223.12,
    imports: 198.16, importsGrowth: 2.19, nonOilImports: 171.61,
    surplus: 35.88, nonOilSurplus: 51.51, oilDeficit: -15.63,
    octExports: 24.24, octImports: 21.84, streakMonths: 66,
    destinations: [
      { name_en: "China", name_id: "Tiongkok", value: 52.45 },
      { name_en: "United States", name_id: "Amerika Serikat", value: 25.56 },
      { name_en: "India", name_id: "India", value: 15.32 }
    ] },

  /* 38 provinces. Population = BPS mid-2025 estimate; area = land area km²;
     density = people per km² (mid-2025). Capitals as listed by BPS/Wikipedia. */
  provinces: [
    { code: "11", en: "Aceh", id: "Aceh", capital: "Banda Aceh", island: "Sumatra", pop: 5626000, area: 56835.02, density: 99 },
    { code: "12", en: "North Sumatra", id: "Sumatera Utara", capital: "Medan", island: "Sumatra", pop: 15785800, area: 72437.76, density: 218 },
    { code: "13", en: "West Sumatra", id: "Sumatera Barat", capital: "Padang", island: "Sumatra", pop: 5914300, area: 42107.67, density: 140 },
    { code: "14", en: "Riau", id: "Riau", capital: "Pekanbaru", island: "Sumatra", pop: 6811200, area: 89900.78, density: 76 },
    { code: "15", en: "Jambi", id: "Jambi", capital: "Jambi", island: "Sumatra", pop: 3768500, area: 49023.04, density: 77 },
    { code: "16", en: "South Sumatra", id: "Sumatera Selatan", capital: "Palembang", island: "Sumatra", pop: 8928500, area: 86771.92, density: 103 },
    { code: "17", en: "Bengkulu", id: "Bengkulu", capital: "Bengkulu", island: "Sumatra", pop: 2138000, area: 20122.21, density: 106 },
    { code: "18", en: "Lampung", id: "Lampung", capital: "Bandar Lampung", island: "Sumatra", pop: 9522900, area: 33570.76, density: 284 },
    { code: "19", en: "Bangka Belitung Islands", id: "Kepulauan Bangka Belitung", capital: "Pangkal Pinang", island: "Sumatra", pop: 1550800, area: 16690.23, density: 93 },
    { code: "21", en: "Riau Islands", id: "Kepulauan Riau", capital: "Tanjung Pinang", island: "Sumatra", pop: 2213500, area: 8170.38, density: 268 },
    { code: "31", en: "Jakarta", id: "Jakarta", capital: "Central Jakarta", island: "Java", pop: 10678000, area: 661.53, density: 16155 },
    { code: "32", en: "West Java", id: "Jawa Barat", capital: "Bandung", island: "Java", pop: 50759000, area: 37053.33, density: 1370 },
    { code: "33", en: "Central Java", id: "Jawa Tengah", capital: "Semarang", island: "Java", pop: 38233900, area: 34347.43, density: 1113 },
    { code: "34", en: "Yogyakarta", id: "DI Yogyakarta", capital: "Yogyakarta", island: "Java", pop: 3781500, area: 3170.36, density: 1193 },
    { code: "35", en: "East Java", id: "Jawa Timur", capital: "Surabaya", island: "Java", pop: 42089300, area: 48055.88, density: 876 },
    { code: "36", en: "Banten", id: "Banten", capital: "Serang", island: "Java", pop: 12537400, area: 9355.88, density: 1341 },
    { code: "51", en: "Bali", id: "Bali", capital: "Denpasar", island: "Nusa Tenggara", pop: 4461300, area: 5582.83, density: 798 },
    { code: "52", en: "West Nusa Tenggara", id: "Nusa Tenggara Barat", capital: "Mataram", island: "Nusa Tenggara", pop: 5731100, area: 19631.99, density: 291 },
    { code: "53", en: "East Nusa Tenggara", id: "Nusa Tenggara Timur", capital: "Kupang", island: "Nusa Tenggara", pop: 5742600, area: 46378.11, density: 124 },
    { code: "61", en: "West Kalimantan", id: "Kalimantan Barat", capital: "Pontianak", island: "Kalimantan", pop: 5766000, area: 147018.06, density: 39 },
    { code: "62", en: "Central Kalimantan", id: "Kalimantan Tengah", capital: "Palangka Raya", island: "Kalimantan", pop: 2845000, area: 153430.36, density: 19 },
    { code: "63", en: "South Kalimantan", id: "Kalimantan Selatan", capital: "Banjarbaru", island: "Kalimantan", pop: 4323300, area: 37125.43, density: 116 },
    { code: "64", en: "East Kalimantan", id: "Kalimantan Timur", capital: "Samarinda", island: "Kalimantan", pop: 4267600, area: 126951.76, density: 34 },
    { code: "65", en: "North Kalimantan", id: "Kalimantan Utara", capital: "Tanjung Selor", island: "Kalimantan", pop: 749400, area: 69900.89, density: 11 },
    { code: "71", en: "North Sulawesi", id: "Sulawesi Utara", capital: "Manado", island: "Sulawesi", pop: 2721400, area: 14488.43, density: 188 },
    { code: "72", en: "Central Sulawesi", id: "Sulawesi Tengah", capital: "Palu", island: "Sulawesi", pop: 3156100, area: 61496.98, density: 51 },
    { code: "73", en: "South Sulawesi", id: "Sulawesi Selatan", capital: "Makassar", island: "Sulawesi", pop: 9563100, area: 45323.98, density: 211 },
    { code: "74", en: "Southeast Sulawesi", id: "Sulawesi Tenggara", capital: "Kendari", island: "Sulawesi", pop: 2836700, area: 36139.30, density: 78 },
    { code: "75", en: "Gorontalo", id: "Gorontalo", capital: "Gorontalo", island: "Sulawesi", pop: 1242200, area: 12024.98, density: 103 },
    { code: "76", en: "West Sulawesi", id: "Sulawesi Barat", capital: "Mamuju", island: "Sulawesi", pop: 1525300, area: 16590.67, density: 92 },
    { code: "81", en: "Maluku", id: "Maluku", capital: "Ambon", island: "Maluku", pop: 1970600, area: 46133.83, density: 43 },
    { code: "82", en: "North Maluku", id: "Maluku Utara", capital: "Sofifi", island: "Maluku", pop: 1373800, area: 31465.98, density: 42 },
    { code: "91", en: "Papua", id: "Papua", capital: "Jayapura", island: "Papua", pop: 1073600, area: 81383.32, density: 13 },
    { code: "92", en: "West Papua", id: "Papua Barat", capital: "Manokwari", island: "Papua", pop: 587600, area: 60308.59, density: 10 },
    { code: "93", en: "South Papua", id: "Papua Selatan", capital: "Merauke", island: "Papua", pop: 549700, area: 117858.97, density: 5 },
    { code: "94", en: "Central Papua", id: "Papua Tengah", capital: "Nabire", island: "Papua", pop: 1492300, area: 61079.59, density: 24 },
    { code: "95", en: "Highland Papua", id: "Papua Pegunungan", capital: "Jayawijaya", island: "Papua", pop: 1484900, area: 52508.66, density: 29 },
    { code: "96", en: "Southwest Papua", id: "Papua Barat Daya", capital: "Sorong", island: "Papua", pop: 636400, area: 39103.06, density: 16 }
  ],

  /* Macro groups used by the Explorer filter (4 groups, per brief). */
  macroGroups: [
    { id: "Sumatra", en: "Sumatra", id_id: "Sumatera", islands: ["Sumatra"] },
    { id: "Java", en: "Java", id_id: "Jawa", islands: ["Java"] },
    { id: "Kalimantan", en: "Kalimantan", id_id: "Kalimantan", islands: ["Kalimantan"] },
    { id: "East", en: "Eastern Indonesia", id_id: "Indonesia Timur",
      islands: ["Sulawesi", "Nusa Tenggara", "Maluku", "Papua"] }
  ]
};
