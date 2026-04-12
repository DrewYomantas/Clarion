# Real Review Expansion Notes

Date: 2026-03-27

Method:
- Collected from public Trustpilot law-firm pages and Trustpilot category pages surfaced via web search.
- Kept only entries with explicit per-review star rating and accessible review text in the page output.
- Stored the broader corpus separately from the existing benchmark CSV.
- Did not mix any newly collected reviews into `data/calibration/inputs/real_reviews.csv`.

Normalization:
- Normalized firm names, cities, states, and practice-area labels into flat CSV columns.
- Preserved source platform, source URL, reviewer label, review date, and a short provenance note for each row.
- Kept short-form reviews when they added needed star-band or geography coverage.

Known limits:
- This batch is Trustpilot-sourced, not Google Maps-sourced.
- Some practices skew toward debt, bankruptcy, and immigration because those firms had public pages with explicit star-rated review text.
- A few rows are concise or lightly edited for normalization, but they remain source-faithful and are marked with provenance notes.
