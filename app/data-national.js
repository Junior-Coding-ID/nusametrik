/* SELAT ATLAS — national data (Malaysia). All figures verified against DOSM
   publications named in sources.js. Years are observation years, never the
   edition year: 2024 figures stay labelled 2024. */
const NATIONAL = {
  population: { value: 34.2, unit: "million", year: 2025, exact: 34220600, note: "Mid-year estimate; sum of 16 states 34,220.6 thousand." },
  gdpGrowth: { value: 5.2, unit: "%", year: 2025, note: "Real GDP growth, year on year." },
  gdpNominal: { value: 2.03, unit: "RM trillion", year: 2025, note: "Current prices. Vintage 15 May 2026; the older RM2.02 trillion release is not used." },
  gdpReal: { value: 1.74, unit: "RM trillion", year: 2025, note: "Constant 2015 prices." },
  gdpShareServicesManufacturing: { value: 82.5, unit: "%", year: 2025, note: "Services plus manufacturing share of GDP." },
  inflation: { value: 1.4, unit: "%", year: 2025, previous: { value: 1.8, year: 2024 }, note: "Annual average CPI." },
  unemployment: { value: 3.0, unit: "%", year: 2025, previous: { value: 3.2, year: 2024 }, note: "Annual average unemployment rate." },
  poverty: { value: 5.1, unit: "%", year: 2024, previous: { value: 6.2, year: 2022 }, note: "Absolute household poverty; households in the official Malaysian-citizen statistical coverage." },
  medianIncome: { value: 7017, unit: "RM/month", year: 2024, note: "Median gross monthly household income." },
  gini: { value: 0.390, unit: "coefficient", year: 2024, previous: { value: 0.404, year: 2022 }, note: "Gini coefficient, 0–1 scale, not percent." },
  internetHousehold: { value: 97.1, unit: "%", year: 2025, note: "Households with internet access." },
  internetIndividual: { value: 98.3, unit: "%", year: 2025, note: "Individuals aged 15+ who used the internet in the last 3 months. Different denominator from household access; never merged." },
  internetUrban: { value: 99.0, unit: "%", year: 2025, note: "Household internet access, urban strata." },
  internetRural: { value: 90.7, unit: "%", year: 2025, note: "Household internet access, rural strata." },
  electricity: { value: 99.9, unit: "%", year: 2024, urban: 100.0, rural: 99.4, note: "Dwellings with electricity access." }
};

const GDP_SERIES = [
  { year: 2020, growth: -5.5 },
  { year: 2021, growth: 3.3 },
  { year: 2022, growth: 9.0 },
  { year: 2023, growth: 3.6 },
  { year: 2024, growth: 5.2 },
  { year: 2025, growth: 5.2 }
];

const SECTORS_2025 = [
  { name: "Construction", growth: 12.2 },
  { name: "Services", growth: 5.4 },
  { name: "Manufacturing", growth: 4.5 },
  { name: "Agriculture", growth: 2.2 },
  { name: "Mining & quarrying", growth: 0.6 }
];

const KPI_HOME = [
  { id: "population", label: "Population", value: "34.2M", detail: "2025 estimate", source: "DOSM" },
  { id: "gdpGrowth", label: "Real GDP growth", value: "+5.2%", detail: "2025, YoY", source: "DOSM" },
  { id: "gdpNominal", label: "Nominal GDP", value: "RM2.03T", detail: "2025", source: "DOSM" },
  { id: "inflation", label: "Inflation (CPI)", value: "1.4%", detail: "2025 annual", source: "DOSM" },
  { id: "unemployment", label: "Unemployment", value: "3.0%", detail: "2025 annual", source: "DOSM" },
  { id: "poverty", label: "Poverty rate", value: "5.1%", detail: "2024, households", source: "DOSM" }
];
