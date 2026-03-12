$socialBlock = @"

## Social Authenticity Rules
All social content and post drafts must comply with ``memory/social_posting_cadence.md``.
Key requirements for every draft produced by this agent:

- **Vary sentence length.** Short sentences after longer ones. Do not open multiple
  consecutive sentences with the same word or construction.
- **No AI-phrasing patterns.** Prohibited: "In today's X landscape", "It's more
  important than ever", "Unlock the power of", "game-changer", "Excited to share".
- **No exaggerated marketing language.** See ``memory/brand_voice.md`` for the full
  prohibited phrases list.
- **Vary format week to week.** Plain text, short observation, question, brief story,
  stat + context -- do not use the same format in back-to-back post drafts.
- **Educational tone over promotional.** If a draft reads like marketing copy, rewrite
  it as a useful observation from an experienced operator.
- **Write for a smart, experienced reader.** Do not over-explain.
- **Flag repetition.** If this run's drafts structurally resemble last week's, note it
  in the report and revise before surfacing.

Cadence guidance (for scheduling proposals only -- do not post directly):
- LinkedIn: 2-4 posts per week, varied days and times
- Twitter/X: 3-6 posts per week
- Occasional skip days are correct behavior, not gaps to fill

"@

function Insert-SocialBlock {
    param($FilePath, $Anchor)
    $raw = [System.IO.File]::ReadAllText($FilePath)
    $normalized = $raw -replace "`r`n", "`n" -replace "`r", "`n"
    $anchorNorm = $Anchor -replace "`r`n", "`n" -replace "`r", "`n"
    $blockNorm = $socialBlock -replace "`r`n", "`n" -replace "`r", "`n"

    if ($normalized -match "## Social Authenticity Rules") {
        Write-Host "Skipped (already present): $FilePath"
        return
    }
    if ($normalized.IndexOf($anchorNorm) -lt 0) {
        Write-Host "ANCHOR NOT FOUND: $FilePath"
        return
    }
    $updated = $normalized.Replace($anchorNorm, $blockNorm + $anchorNorm)
    [System.IO.File]::WriteAllText($FilePath, $updated, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Updated: $FilePath"
}

$base = "C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents"

# content_seo.md -- anchor is the Guardrails line
Insert-SocialBlock `
    -FilePath "$base\comms\content_seo.md" `
    -Anchor "## Guardrails`nNever: schedule/publish/post/distribute"

# head_of_growth.md -- anchor is the Guardrails line (already rewritten to clean UTF-8)
Insert-SocialBlock `
    -FilePath "$base\revenue\head_of_growth.md" `
    -Anchor "## Guardrails`nNever: modify code/dictionary"

Write-Host "Done."
