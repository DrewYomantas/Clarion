$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents"

function Insert-EmailOps {
    param(
        [string]$FilePath,
        [string]$GuardrailsAnchor,
        [string]$EmailOpsBlock
    )
    $raw = [System.IO.File]::ReadAllText($FilePath)
    $content = $raw -replace "`r`n", "`n" -replace "`r", "`n"
    $anchor = $GuardrailsAnchor -replace "`r`n", "`n" -replace "`r", "`n"

    if ($content -match "## Email Operations") {
        Write-Host "Already present: $FilePath"
        return
    }
    if ($content.IndexOf($anchor) -lt 0) {
        Write-Host "ANCHOR NOT FOUND: $FilePath"
        return
    }
    $updated = $content.Replace($anchor, $EmailOpsBlock + "`n" + $anchor)
    [System.IO.File]::WriteAllText($FilePath, $updated, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Updated: $FilePath"
}

# ── 1. Head of Growth ────────────────────────────────────────────────────────
$hogBlock = @"
## Email Operations
Read ``memory/email_routing_policy.md``, ``memory/email_response_policy.md``,
``memory/outreach_email_policy.md``, and ``memory/internal_notification_policy.md``
before handling any email signal this run.

Routing responsibilities for this agent:
- SALES/INTEREST inbound emails → owned by this division
- Waitlist signups → owned by this division (see internal_notification_policy.md)
- Demo requests → shared with Sales Development; log and acknowledge

Auto-reply permitted for: general product questions, demo curiosity, feature explanations.
Do NOT reply to: pricing negotiations, partnerships, press, investor inquiries, serious complaints.
Escalate those immediately to Chief of Staff.

Outreach: Prepare drafts freely. Do NOT send any outbound campaign without an approved
OUTREACH APPROVAL PACKAGE logged in ``memory/approved_actions.md``.

Log all meaningful inbound signals to ``memory/email_log.md`` this run.
"@

# ── 2. Sales Development ────────────────────────────────────────────────────
$sdBlock = @"
## Email Operations
Read ``memory/email_routing_policy.md``, ``memory/email_response_policy.md``,
``memory/outreach_email_policy.md``, and ``memory/internal_notification_policy.md``
before handling any email signal this run.

Routing responsibilities for this agent:
- SALES/INTEREST inbound emails → owned by this division
- Demo requests → owned by this division (see internal_notification_policy.md)
- GENERAL/UNCLEAR with sales intent → classify and route to Revenue

Auto-reply permitted for: general product questions, demo curiosity, feature explanations.
Do NOT reply to: pricing negotiations, partnerships, press, investor inquiries.
Escalate those immediately to Chief of Staff.

Outreach: Prepare drafts freely. Do NOT send any outbound campaign without an approved
OUTREACH APPROVAL PACKAGE logged in ``memory/approved_actions.md``.

Log all meaningful inbound signals to ``memory/email_log.md`` this run.
"@

# ── 3. Customer Health & Onboarding ─────────────────────────────────────────
$custBlock = @"
## Email Operations
Read ``memory/email_routing_policy.md``, ``memory/email_response_policy.md``,
and ``memory/internal_notification_policy.md`` before handling any email signal this run.

Routing responsibilities for this agent:
- SUPPORT inbound emails → owned by this division
- Bug reports with account impact → shared with Product Integrity (see internal_notification_policy.md)

Auto-reply permitted for: onboarding questions, feature explanations, documentation requests,
routine support queries.
Do NOT reply to: serious complaints, data or security concerns, account billing issues,
legal language. Escalate those immediately to Chief of Staff.

Log all meaningful inbound signals to ``memory/email_log.md`` this run.
"@

# ── 4. Usage Analyst ─────────────────────────────────────────────────────────
$usageBlock = @"
## Email Operations
Read ``memory/email_routing_policy.md``, ``memory/email_response_policy.md``,
and ``memory/internal_notification_policy.md`` before handling any email signal this run.

Routing responsibilities for this agent:
- CUSTOMER FEEDBACK inbound emails → owned by this division
- Product feedback form submissions → owned by this division (see internal_notification_policy.md)

Auto-reply permitted for: feedback acknowledgement only. Do not make feature commitments
or roadmap statements in any reply.
Do NOT reply to: complaints with legal or escalation language. Route those to Chief of Staff.

Surface recurring feature request themes in the weekly report FINDINGS section.
Log all meaningful inbound signals to ``memory/email_log.md`` this run.
"@

# ── 5. Content & SEO ─────────────────────────────────────────────────────────
$contentBlock = @"
## Email Operations
Read ``memory/email_routing_policy.md``, ``memory/email_response_policy.md``,
and ``memory/outreach_email_policy.md`` before handling any email signal this run.

Routing responsibilities for this agent:
- PRESS/MEDIA inbound emails → escalate immediately to Chief of Staff; do not reply
- Content collaboration proposals → treat as PARTNERSHIPS; escalate to Chief of Staff

Outreach: Prepare email drafts and sequences freely as part of content planning.
Do NOT send any outbound email campaign without an approved OUTREACH APPROVAL PACKAGE
logged in ``memory/approved_actions.md``.

Log all meaningful inbound signals to ``memory/email_log.md`` this run.
"@

# Run all insertions
Insert-EmailOps `
    -FilePath "$base\revenue\head_of_growth.md" `
    -GuardrailsAnchor "## Guardrails`nNever: modify code/dictionary" `
    -EmailOpsBlock $hogBlock

Insert-EmailOps `
    -FilePath "$base\revenue\sales_development.md" `
    -GuardrailsAnchor "## Guardrails`nNever: modify code/dictionary" `
    -EmailOpsBlock $sdBlock

Insert-EmailOps `
    -FilePath "$base\customer\customer_health_onboarding.md" `
    -GuardrailsAnchor "## Guardrails`nNever: modify code/dictionary" `
    -EmailOpsBlock $custBlock

Insert-EmailOps `
    -FilePath "$base\product_insight\usage_analyst.md" `
    -GuardrailsAnchor "## Guardrails`nNever: modify code/dictionary" `
    -EmailOpsBlock $usageBlock

Insert-EmailOps `
    -FilePath "$base\comms\content_seo.md" `
    -GuardrailsAnchor "## Guardrails`nNever: schedule/publish/post/distribute" `
    -EmailOpsBlock $contentBlock

Write-Host "Done."
