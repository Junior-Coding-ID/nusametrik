# SELAT ATLAS — Malaysia National Statistics Atlas

[![Competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539) [![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Junior-Coding-ID/nusametrik/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539) [![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Junior-Coding-ID/nusametrik/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**SELAT ATLAS** is a static national statistics atlas for Malaysia — *“A nation in sixteen perspectives.”* 2025 Annual Edition. Four pages, thirteen charts, zero external requests, zero tracking.

## What it covers

- **National Overview** — six headline KPIs, real GDP growth 2020–2025, a mini tile cartogram of all sixteen states and federal territories, and three insights computed from the dataset.
- **Economy** — nominal and real GDP, inflation, unemployment, sector growth 2025 against the 5.2% national benchmark, and the 82.5% services-plus-manufacturing share of GDP.
- **People & Living** — poverty (6.2% → 5.1%, 2022 → 2024), Gini (0.404 → 0.390), the urban–rural internet gap (99.0% vs 90.7%, gap 8.3 pp), electricity access (99.9%).
- **State Explorer** — all sixteen states and federal territories on four indicators (population 2025, poverty 2024, median income 2024, household internet 2025), with a tile cartogram, ranking, two-state comparison against the national benchmark, search / filter / sort, and CSV export that follows the active filter and sort.

## Data

All figures are labelled with observation year and publication. National figures come from the Department of Statistics Malaysia (DOSM): Current Population Estimates 2025 (31 Jul 2025), Gross Domestic Product 2025 (15 May 2026), Analysis of Annual CPI 2025 (29 Apr 2026), Labour Force Survey 2025 (26 Jun 2026), Poverty in Malaysia 2024 (8 Oct 2025), Household Income Survey Report 2024 (8 Oct 2025), Income Inequality 2024 (8 Oct 2025), ICT Survey Report 2025 (23 Apr 2026), Basic Amenities Survey Report 2024 (24 Dec 2025).

Regional data (64 cells: 4 indicators × 16 states) comes from the OpenDOSM data catalogues, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): `population_state`, `hh_poverty_state`, `hies_state`, `hh_access_internet`. The full citation list, dataset filters and methodology are on the State Explorer page (`states.html#sources`).

Methodology notes: 2024 figures stay labelled 2024; national benchmarks are not averages of the sixteen regions; household and individual internet use are different measures and are never merged; Kuala Lumpur and Putrajaya are fully urban, so missing rural data is never shown as 0%; the “Malaysia” row in the internet file is a national benchmark, not a seventeenth state.

## Run locally

```sh
python3 -m http.server 8000 --directory app
# open http://localhost:8000/
```

Or open `app/index.html` directly — the site works from `file://` too.

## Structure

```
app/
  index.html  economy.html  people.html  states.html
  style.css
  data-national.js  data-states.js  sources.js
  core.js  charts.js  state-explorer.js
  logo.svg
screenshots/   main.ts   vendor/makefun-frontend.ts
```

## License

MIT — see `LICENSE`.
