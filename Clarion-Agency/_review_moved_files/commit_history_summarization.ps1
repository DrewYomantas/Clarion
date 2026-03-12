Set-Location "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main"
git add Clarion-Agency/memory/history_summaries.md
git add Clarion-Agency/memory/history_summarization_upgrade.md
git add Clarion-Agency/agents/executive/chief_of_staff.md
git commit -m "agency: add historical summarization layer for long-running memory logs

- Create memory/history_summaries.md (append-only, dated summary entries)
- chief_of_staff.md: add history_summaries.md to Inputs
- chief_of_staff.md: add Section G (Historical Summarization Check) with
  thresholds for 6 logs and 4-step summarization procedure
- chief_of_staff.md: add HISTORICAL SUMMARIZATION block to CEO brief format
- Create memory/history_summarization_upgrade.md (completion note)
- No existing logs or agent files modified"
git push origin main
