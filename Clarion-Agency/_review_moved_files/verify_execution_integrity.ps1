# verify_execution_integrity.ps1
$base = 'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\Clarion-Agency\agents'
$files = Get-ChildItem -Path $base -Recurse -Filter '*.md'
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $hits = [regex]::Matches($content, '## Execution Integrity Rule')
    if ($hits.Count -gt 0) {
        Write-Host ($hits.Count.ToString() + " instance(s): " + $f.Name)
    }
}
Write-Host "Verification complete."
