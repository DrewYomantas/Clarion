$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents\executive\chief_of_staff.md"
$raw = [System.IO.File]::ReadAllText($base)
$content = $raw -replace "`r`n", "`n" -replace "`r", "`n"

# ── Change 1: Add email_log.md to Inputs (after history_summaries line) ─────
$inputAnchor = "- ``history_summaries.md`` - read before ingesting any full log. If a summary entry exists for a log file, use the summary as the primary reference. Only read the full log if exact historical detail is required for a specific decision or escalation."
$inputReplacement = $inputAnchor + "`n- ``email_log.md`` - scan for new entries since last run. Surface recurring themes, escalation-flagged emails, and unrouted GENERAL/UNCLEAR entries under EMAIL SIGNALS in the CEO brief."

if ($content -match "email_log\.md.*scan for new entries") {
    Write-Host "Input line already present"
} elseif ($content.IndexOf($inputAnchor) -lt 0) {
    Write-Host "INPUT ANCHOR NOT FOUND"
} else {
    $content = $content.Replace($inputAnchor, $inputReplacement)
    Write-Host "Added email_log.md to Inputs"
}

# ── Change 2: Add EMAIL SIGNALS block to brief format ───────────────────────
# Insert between SOCIAL HEALTH and HISTORICAL SUMMARIZATION
$briefAnchor = "---`nHISTORICAL SUMMARIZATION"

$emailSignalsBlock = @"
---
EMAIL SIGNALS
[None. | For each notable signal or theme from email_log.md since last run:
  Type: [SALES/INTEREST | CUSTOMER FEEDBACK | SUPPORT | PARTNERSHIPS | PRESS/MEDIA | INVESTOR | GENERAL/UNCLEAR]
  Summary: [One sentence -- what the signal was]
  Routed to: [Division]
  Action taken: [Auto-replied | Escalated | Pending | Logged only]
  Follow-up needed: [Yes -- one sentence on what | No]
  ---
Unrouted GENERAL/UNCLEAR entries: [None. | List each with a recommended classification.]
Recurring themes this cycle: [None. | One sentence per pattern.]]

"@

if ($content -match "EMAIL SIGNALS") {
    Write-Host "EMAIL SIGNALS block already present"
} elseif ($content.IndexOf($briefAnchor) -lt 0) {
    Write-Host "BRIEF ANCHOR NOT FOUND"
} else {
    $content = $content.Replace($briefAnchor, $emailSignalsBlock + $briefAnchor)
    Write-Host "Added EMAIL SIGNALS to brief format"
}

[System.IO.File]::WriteAllText($base, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "chief_of_staff.md written."
