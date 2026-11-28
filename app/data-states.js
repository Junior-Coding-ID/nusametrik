/* SELAT ATLAS — regional dataset: 4 indicators x 16 states & federal territories.
   Values verified cell by cell from the four OpenDOSM CSVs (CC BY 4.0) by the
   parent on 28 Nov 2026; re-check script output is in the build report.
   Population is in thousands. Poverty is percent of households. Income is
   median gross RM per month. Internet is percent of households.
   Tile positions (gx, gy) are a schematic cartogram, not a geographic map. */
const STATES = [
  { code: "JHR", name: "Johor", group: "Peninsular", gx: 5, gy: 4, population: 4204.1, poverty: 2.5, income: 7712, internet: 99.0 },
  { code: "KDH", name: "Kedah", group: "Peninsular", gx: 2, gy: 1, population: 2227.1, poverty: 8.4, income: 4895, internet: 96.7 },
  { code: "KTN", name: "Kelantan", group: "Peninsular", gx: 2, gy: 2, population: 1906.9, poverty: 11.5, income: 4083, internet: 95.4 },
  { code: "MLK", name: "Melaka", group: "Peninsular", gx: 4, gy: 4, population: 1052.0, poverty: 3.0, income: 6891, internet: 97.3 },
  { code: "NSN", name: "Negeri Sembilan", group: "Peninsular", gx: 4, gy: 3, population: 1243.9, poverty: 4.0, income: 5591, internet: 97.0 },
  { code: "PHG", name: "Pahang", group: "Peninsular", gx: 4, gy: 2, population: 1676.8, poverty: 5.9, income: 4975, internet: 96.1 },
  { code: "PNG", name: "Pulau Pinang", group: "Peninsular", gx: 3, gy: 1, population: 1804.3, poverty: 1.9, income: 7386, internet: 99.7 },
  { code: "PRK", name: "Perak", group: "Peninsular", gx: 4, gy: 1, population: 2573.8, poverty: 6.9, income: 4687, internet: 96.1 },
  { code: "PLS", name: "Perlis", group: "Peninsular", gx: 1, gy: 1, population: 297.0, poverty: 3.6, income: 4950, internet: 96.9 },
  { code: "SGR", name: "Selangor", group: "Peninsular", gx: 2, gy: 3, population: 7408.7, poverty: 0.9, income: 10726, internet: 99.6 },
  { code: "TRG", name: "Terengganu", group: "Peninsular", gx: 3, gy: 2, population: 1245.8, poverty: 5.8, income: 6627, internet: 95.4 },
  { code: "SBH", name: "Sabah", group: "East Malaysia", gx: 7, gy: 1, population: 3754.5, poverty: 17.7, income: 4890, internet: 91.6 },
  { code: "SWK", name: "Sarawak", group: "East Malaysia", gx: 6, gy: 1, population: 2528.9, poverty: 8.4, income: 5504, internet: 91.7 },
  { code: "KUL", name: "W.P. Kuala Lumpur", group: "Peninsular", gx: 3, gy: 3, population: 2075.2, poverty: 1.0, income: 10802, internet: 100.0 },
  { code: "LBN", name: "W.P. Labuan", group: "East Malaysia", gx: 7, gy: 2, population: 100.9, poverty: 2.0, income: 7383, internet: 99.8 },
  { code: "PJY", name: "W.P. Putrajaya", group: "Peninsular", gx: 3, gy: 4, population: 120.7, poverty: 0.2, income: 10769, internet: 100.0 }
];

const INDICATORS = {
  population: { key: "population", label: "Population", short: "Population", year: 2025, unit: "thousand people", format: "thousands", benchmark: 34220.6, benchmarkLabel: "Malaysia: 34.2 million", higherIs: "larger", ramp: "cobalt" },
  poverty: { key: "poverty", label: "Absolute poverty", short: "Poverty", year: 2024, unit: "% of households", format: "percent1", benchmark: 5.1, benchmarkLabel: "Malaysia: 5.1%", higherIs: "worse", ramp: "brick" },
  income: { key: "income", label: "Median household income", short: "Median income", year: 2024, unit: "RM / month", format: "rm", benchmark: 7017, benchmarkLabel: "Malaysia: RM7,017 / month", higherIs: "larger", ramp: "cobalt" },
  internet: { key: "internet", label: "Household internet access", short: "Internet", year: 2025, unit: "% of households", format: "percent1", benchmark: 97.1, benchmarkLabel: "Malaysia: 97.1%", higherIs: "larger", ramp: "cobalt" }
};

const INDICATOR_ORDER = ["population", "poverty", "income", "internet"];

function stateByCode(code) {
  for (let i = 0; i < STATES.length; i++) if (STATES[i].code === code) return STATES[i];
  return null;
}

function indicatorValues(key) {
  return STATES.map(function (s) { return s[key]; });
}

function stateTotalPopulation() {
  let total = 0;
  for (let i = 0; i < STATES.length; i++) total += STATES[i].population;
  return total;
}
