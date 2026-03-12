$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents\executive\chief_of_staff.md"
$raw = [System.IO.File]::ReadAllText($base)
$content = $raw -replace "`r`n", "`n" -replace "`r", "`n"

# Fix 1: Add blank line before E. Operational Risk Level after Section H
$badJoin = "If none of these patterns are present, write ``None detected.`` in the SOCIAL HEALTH section.`n**E. Operational Risk Level**"
$goodJoin = "If none of these patterns are present, write ``None detected.`` in the SOCIAL HEALTH section.`n`n**E. Operational Risk Level**"
if ($content.Contains($badJoin)) {
    $content = $content.Replace($badJoin, $goodJoin)
    Write-Host "Fixed Section H spacing"
} else {
    Write-Host "Section H spacing already correct or not found"
}

# Fix 2: Insert SOCIAL HEALTH block into brief format (between MISSING REPORTS and HISTORICAL SUMMARIZATION)
$anchor = "---`nHISTORICAL SUMMARIZATION"
$socialBriefBlock = @"
---
SOCIAL HEALTH
[None detected. | For each flagged pattern:
  Agent: [Content & SEO | Head of Growth | Both]
  Pattern: [Overly regular | Overly frequent | Repetitive structure | Volume over quality | Promotional drift]
  Detail: [One sentence describing what was observed]
  Recommendation: [One sentence -- vary cadence / revise drafts / reduce volume]
  ---]

"@
if ($content -match "SOCIAL HEALTH") {
    Write-Host "SOCIAL HEALTH brief block already present"
} elseif ($content.IndexOf($anchor) -lt 0) {
    Write-Host "ANCHOR NOT FOUND for SOCIAL HEALTH brief block"
} else {
    $content = $content.Replace($anchor, $socialBriefBlock + $anchor)
    Write-Host "Inserted SOCIAL HEALTH brief block"
}

[System.IO.File]::WriteAllText($base, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "chief_of_staff.md written."
