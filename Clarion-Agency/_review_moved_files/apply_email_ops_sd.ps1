$file = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents\revenue\sales_development.md"
$raw = [System.IO.File]::ReadAllText($file)
$content = $raw -replace "`r`n", "`n" -replace "`r", "`n"

if ($content -match "## Email Operations") {
    Write-Host "Already present"
    exit
}

$anchor = "## Guardrails`nNever: send or deploy live communications"

$sdBlock = @"
## Email Operations
Read ``memory/email_routing_policy.md``, ``memory/email_response_policy.md``,
and ``memory/outreach_email_policy.md`` before handling any email signal this run.

Routing responsibilities for this agent:
- SALES/INTEREST inbound emails -> owned by this division
- Demo requests -> owned by this division (see internal_notification_policy.md)
- GENERAL/UNCLEAR with sales intent -> classify and route to Revenue

Auto-reply permitted for: general product questions, demo curiosity, feature explanations.
Do NOT reply to: pricing negotiations, partnerships, press, investor inquiries.
Escalate those immediately to Chief of Staff.

Outreach: Prepare drafts freely. Do NOT send any outbound campaign without an approved
OUTREACH APPROVAL PACKAGE logged in ``memory/approved_actions.md``.

Log all meaningful inbound signals to ``memory/email_log.md`` this run.

"@

if ($content.IndexOf($anchor) -lt 0) {
    Write-Host "ANCHOR NOT FOUND -- dumping guardrails context:"
    $idx = $content.IndexOf("## Guardrails")
    Write-Host $content.Substring($idx, [Math]::Min(120, $content.Length - $idx))
} else {
    $updated = $content.Replace($anchor, $sdBlock + $anchor)
    [System.IO.File]::WriteAllText($file, $updated, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Updated: sales_development.md"
}
