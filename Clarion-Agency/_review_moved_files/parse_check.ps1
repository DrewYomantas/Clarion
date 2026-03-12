$errors = $null
$tokens = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile(
    'C:\Users\beyon\OneDrive\Desktop\CLARION\law-firm-insights-main\frontend\sample_data\run_full_calibration.ps1',
    [ref]$tokens,
    [ref]$errors
)
if ($errors.Count -eq 0) {
    Write-Host "PARSE OK - no errors"
} else {
    Write-Host "PARSE ERRORS: $($errors.Count)"
    foreach ($e in $errors) {
        Write-Host "  Line $($e.Extent.StartLineNumber) Col $($e.Extent.StartColumnNumber): $($e.Message)"
        Write-Host "  Text: $($e.Extent.Text)"
    }
}
