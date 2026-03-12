$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents\executive\chief_of_staff.md"
$raw = [System.IO.File]::ReadAllText($base)
$content = $raw -replace "`r`n", "`n" -replace "`r", "`n"

# The exact transition in the brief format code block:
# "MISSING REPORTS\n[None. | Each expected report not filed this cycle, one per line.]\n\n---\nHISTORICAL SUMMARIZATION"
$anchor = "MISSING REPORTS`n[None. | Each expected report not filed this cycle, one per line.]`n`n---`nHISTORICAL SUMMARIZATION"

$replacement = @"
MISSING REPORTS
[None. | Each expected report not filed this cycle, one per line.]

---
SOCIAL HEALTH
[None detected. | For each flagged pattern:
  Agent: [Content & SEO | Head of Growth | Both]
  Pattern: [Overly regular | Overly frequent | Repetitive structure | Volume over quality | Promotional drift]
  Detail: [One sentence describing what was observed]
  Recommendation: [One sentence -- vary cadence / revise drafts / reduce volume]
  ---]

---
HISTORICAL SUMMARIZATION
"@

if ($content.IndexOf($anchor) -lt 0) {
    Write-Host "ANCHOR NOT FOUND"
    # Show what's actually around MISSING REPORTS in the brief format
    $idx = $content.LastIndexOf("MISSING REPORTS")
    Write-Host "Context: " + $content.Substring($idx, [Math]::Min(200, $content.Length - $idx))
} else {
    $content = $content.Replace($anchor, $replacement)
    [System.IO.File]::WriteAllText($base, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Inserted SOCIAL HEALTH brief format block"
}
