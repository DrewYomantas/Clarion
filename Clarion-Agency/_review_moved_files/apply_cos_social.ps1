$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents\executive\chief_of_staff.md"

$raw = [System.IO.File]::ReadAllText($base)
$content = $raw -replace "`r`n", "`n" -replace "`r", "`n"

# ── Insertion 1: Section H in Office Health Evaluation ──────────────────────
$sectionH = @"

**H. Social Health Check**
Read the WORK COMPLETED THIS RUN sections of Content & SEO and Head of Growth reports.
Check any post drafts or scheduling proposals against ``memory/social_posting_cadence.md``.

Flag in the CEO brief under SOCIAL HEALTH if any of the following are detected:

| Pattern | Flag when |
|---|---|
| Overly regular cadence | Same posting days or times proposed 3+ weeks running |
| Overly frequent | LinkedIn >5 posts/week or Twitter >8 posts/week sustained |
| Repetitive structure | Same sentence opening or format in 3+ consecutive post drafts |
| Volume over quality | Multiple posts proposed for one day with thin substance |
| Promotional drift | 3+ consecutive drafts with no educational value |

If none of these patterns are present, write ``None detected.`` in the SOCIAL HEALTH section.

"@

$anchor1 = "**E. Operational Risk Level**"
if ($content -match "## Social Health Check") {
    Write-Host "Section H already present - skipping insertion 1"
} elseif ($content.IndexOf($anchor1) -lt 0) {
    Write-Host "ANCHOR 1 NOT FOUND"
} else {
    $content = $content.Replace($anchor1, $sectionH + $anchor1)
    Write-Host "Inserted Section H"
}

# ── Insertion 2: SOCIAL HEALTH block in CEO Brief Report Format ─────────────
$socialHealthBlock = @"

---
SOCIAL HEALTH
[None detected. | For each flagged pattern:
  Agent: [Content & SEO | Head of Growth]
  Pattern: [Overly regular | Overly frequent | Repetitive structure | Volume over quality | Promotional drift]
  Detail: [One sentence describing what was observed]
  Recommendation: [One sentence -- vary cadence / revise drafts / reduce volume]
  ---]

"@

$anchor2 = "---`nHISTORICAL SUMMARIZATION"
if ($content -match "SOCIAL HEALTH") {
    Write-Host "SOCIAL HEALTH block already present - skipping insertion 2"
} elseif ($content.IndexOf($anchor2) -lt 0) {
    Write-Host "ANCHOR 2 NOT FOUND"
} else {
    $content = $content.Replace($anchor2, $socialHealthBlock + $anchor2)
    Write-Host "Inserted SOCIAL HEALTH brief section"
}

[System.IO.File]::WriteAllText($base, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "chief_of_staff.md written."
