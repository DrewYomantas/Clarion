# fix_execution_integrity.ps1
# Adds exactly one Execution Integrity Rule block to each weekly-cadence agent file.
# Safe to re-run: strips any existing block(s) first, then inserts one clean instance.

$ruleBlock = @"

## Execution Integrity Rule
WORK COMPLETED THIS RUN must contain only concrete, completed work:
- Concrete deliverables created (drafts, outlines, trackers, analysis docs)
- Project state changes (status updated, milestone reached, blocker removed)
- Documented research outcomes (sources reviewed, findings recorded)
- Completed analysis (data reviewed, patterns identified, conclusions drawn)
- Prepared assets (templates built, frameworks drafted, data structured)

Prohibited entries:
- Vague planning statements ("will explore...", "plan to review...")
- Generic brainstorming ("could consider...", "might be worth...")
- Speculative ideas with no completed output

If no meaningful work was completed this run, write exactly:
"No significant progress this run."

Consecutive stall rule: If you are reporting "No significant progress this run." for the second consecutive run on the same active project, you must also update that project in memory/projects.md: set Blocked? = Yes and Escalate? = Yes, and include a one-sentence blocker description.

"@

$targets = @(
    [pscustomobject]@{ File = "agents\market\competitive_intelligence.md";     Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\market\customer_discovery.md";           Anchor = "## Hard Rules" },
    [pscustomobject]@{ File = "agents\revenue\head_of_growth.md";              Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\comms\content_seo.md";                   Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\operations\cost_resource.md";            Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\operations\process_analyst.md";          Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\customer\customer_health_onboarding.md"; Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\customer\voc_product_demand.md";         Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\product_insight\usage_analyst.md";       Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\product_integrity\data_quality.md";      Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\product_integrity\scoring_quality.md";   Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\revenue\funnel_conversion.md";           Anchor = "## Guardrails" },
    [pscustomobject]@{ File = "agents\revenue\sales_development.md";           Anchor = "## Guardrails" }
)

$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency"

foreach ($t in $targets) {
    $path = Join-Path $base $t.File
    if (-not (Test-Path $path)) {
        Write-Host "MISSING: $path"
        continue
    }

    $raw = Get-Content $path -Raw -Encoding UTF8

    # Strip ALL existing Execution Integrity Rule blocks
    # Match from the header line through everything up to (not including) the next ## heading
    $stripped = $raw -replace '(?s)## Execution Integrity Rule\r?\n.*?(?=\r?\n## )', ''

    # Insert one clean block immediately before the anchor line
    $anchor = [regex]::Escape($t.Anchor)
    $final = $stripped -replace "(?m)^($anchor)", "$ruleBlock`$1"

    # Verify exactly one instance
    $count = ([regex]::Matches($final, '## Execution Integrity Rule')).Count
    $msg = "OK (" + $count.ToString() + " instance): " + $t.File
    if ($count -ne 1) {
        $msg = "WARNING (" + $count.ToString() + " instances): " + $t.File + " - check manually"
    } else {
        Set-Content -Path $path -Value $final -Encoding UTF8 -NoNewline
    }
    Write-Host $msg
}

Write-Host ""
Write-Host "Done."
