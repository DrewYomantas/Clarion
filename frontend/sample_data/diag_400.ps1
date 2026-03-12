# diag_400.ps1 - sends a minimal 1-review payload and prints the full response body
$ErrorActionPreference = "Continue"

$timestamp   = Get-Date -Format "yyyyMMdd_HHmmss"
$exportLabel = "diag_$timestamp"

$payload = @{
    reviews       = @(@{ review_text = "test review"; rating = 3; date = "2025-01-01" })
    enable_ai     = $true
    fixtures      = $false
    export_report = $true
    export_label  = $exportLabel
} | ConvertTo-Json -Depth 10 -Compress

$payloadBytes = [System.Text.Encoding]::UTF8.GetBytes($payload)

Write-Host "Payload: $payload"
Write-Host ""

try {
    $resp = Invoke-WebRequest `
        -Uri "http://localhost:5000/internal/benchmark/batch" `
        -Method POST `
        -Headers @{ "Authorization" = "Bearer Themepark12"; "Content-Type" = "application/json" } `
        -Body $payloadBytes `
        -TimeoutSec 30 `
        -UseBasicParsing
    Write-Host "Status: $($resp.StatusCode)"
    Write-Host $resp.Content
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status: $statusCode"
    try {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host $reader.ReadToEnd()
    } catch {
        Write-Host "Could not read response body: $($_.Exception.Message)"
    }
}
