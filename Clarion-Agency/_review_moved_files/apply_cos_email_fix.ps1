$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents\executive\chief_of_staff.md"
$raw = [System.IO.File]::ReadAllText($base)
$content = $raw -replace "`r`n", "`n" -replace "`r", "`n"

# ── Fix 1: Brief format — add blank line between EMAIL SIGNALS and HISTORICAL SUMMARIZATION ──
$badJoin = "Recurring themes this cycle: [None. | One sentence per pattern.]]`n---`nHISTORICAL SUMMARIZATION"
$goodJoin = "Recurring themes this cycle: [None. | One sentence per pattern.]]`n`n---`nHISTORICAL SUMMARIZATION"
if ($content.Contains($badJoin)) {
    $content = $content.Replace($badJoin, $goodJoin)
    Write-Host "Fixed EMAIL SIGNALS spacing"
} else {
    Write-Host "Spacing already correct or pattern not found (check brief block)"
}

# ── Fix 2: Inputs — add email_log.md after history_summaries line ────────────
# Use the exact em-dash character from the file
$inputAnchor = "- ``history_summaries.md`` " + [char]0x2014 + " read before ingesting any full log. If a summary entry exists for a log file, use the summary as the primary reference. Only read the full log if exact historical detail is required for a specific decision or escalation."
$emailInputLine = "`n- ``email_log.md`` " + [char]0x2014 + " scan for new entries since last run. Surface recurring themes, escalation-flagged emails, and unrouted GENERAL/UNCLEAR entries under EMAIL SIGNALS in the CEO brief."

if ($content -match "email_log\.md.*scan for new entries") {
    Write-Host "Input line already present"
} elseif ($content.IndexOf($inputAnchor) -lt 0) {
    # Try ASCII dash fallback
    $inputAnchorAscii = "- ``history_summaries.md`` - read before ingesting any full log. If a summary entry exists for a log file, use the summary as the primary reference. Only read the full log if exact historical detail is required for a specific decision or escalation."
    $emailInputLineAscii = "`n- ``email_log.md`` - scan for new entries since last run. Surface recurring themes, escalation-flagged emails, and unrouted GENERAL/UNCLEAR entries under EMAIL SIGNALS in the CEO brief."
    if ($content.IndexOf($inputAnchorAscii) -lt 0) {
        Write-Host "INPUT ANCHOR NOT FOUND (both variants)"
    } else {
        $content = $content.Replace($inputAnchorAscii, $inputAnchorAscii + $emailInputLineAscii)
        Write-Host "Added email_log.md to Inputs (ASCII dash)"
    }
} else {
    $content = $content.Replace($inputAnchor, $inputAnchor + $emailInputLine)
    Write-Host "Added email_log.md to Inputs (em-dash)"
}

[System.IO.File]::WriteAllText($base, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "chief_of_staff.md written."
