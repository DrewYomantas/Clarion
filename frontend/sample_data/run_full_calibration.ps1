# run_full_calibration.ps1
# Scans frontend/sample_data for all *.csv files, runs make_calibration_batch.py
# on each, merges all reviews into one combined batch, POSTs in chunks to the
# benchmark endpoint, and saves the raw JSON response to a timestamped file.

$ErrorActionPreference = "Stop"

# --- Config ------------------------------------------------------------------
$BENCHMARK_URL = "http://localhost:5000/internal/benchmark/batch"
$AUTH_TOKEN    = "Bearer Themepark12"
$TIMEOUT_SEC   = 300
$CHUNK_SIZE    = 100
$SCRIPT_DIR    = Split-Path -Parent $MyInvocation.MyCommand.Path
$PYTHON_SCRIPT = Join-Path $SCRIPT_DIR "make_calibration_batch.py"

# --- Timestamp ---------------------------------------------------------------
$timestamp   = Get-Date -Format "yyyyMMdd_HHmmss"
$exportLabel = "full_batch_$timestamp"
$outputFile  = ".\calibration_full_batch_${timestamp}_result.json"

# --- Step 1: Discover CSVs ---------------------------------------------------
$csvFiles = Get-ChildItem -Path $SCRIPT_DIR -Filter "*.csv" -File
Write-Host "CSVs found: $($csvFiles.Count)"

if ($csvFiles.Count -eq 0) {
    Write-Error "No CSV files found in $SCRIPT_DIR - aborting."
    exit 1
}

# --- Step 2: Parse each CSV via make_calibration_batch.py --------------------
$allReviews = [System.Collections.Generic.List[object]]::new()

foreach ($csv in $csvFiles) {
    Write-Host "Processing: $($csv.Name) ..." -NoNewline
    try {
        $rawOutput = python $PYTHON_SCRIPT $csv.FullName 2>&1
        $exitCode  = $LASTEXITCODE

        if ($exitCode -ne 0 -or [string]::IsNullOrWhiteSpace($rawOutput)) {
            Write-Host " WARN: script returned exit $exitCode or empty output - skipping."
            continue
        }

        $jsonLine = ($rawOutput -split "`n" | Where-Object { $_.Trim() -ne "" } | Select-Object -Last 1).Trim()
        $parsed   = $jsonLine | ConvertFrom-Json
        $reviews  = $parsed.reviews

        if ($null -eq $reviews -or $reviews.Count -eq 0) {
            Write-Host " WARN: 0 reviews parsed - skipping."
            continue
        }

        # Normalize each review to exactly the required shape
        foreach ($r in $reviews) {
            $reviewText = if ($r.review_text) { [string]$r.review_text } else { "" }
            if ([string]::IsNullOrWhiteSpace($reviewText)) { continue }

            $ratingRaw = if ($null -ne $r.rating) { $r.rating } else { 3 }
            $ratingInt = try { [int][Math]::Round([double]"$ratingRaw") } catch { 3 }
            if ($ratingInt -lt 1 -or $ratingInt -gt 5) { $ratingInt = 3 }

            $dateVal = if ($r.date) { [string]$r.date } 
                       elseif ($r.review_date) { [string]$r.review_date } 
                       else { "2025-01-01" }

            $allReviews.Add([PSCustomObject]@{
                review_text = $reviewText
                rating      = $ratingInt
                date        = $dateVal
            })
        }
        Write-Host " $($reviews.Count) reviews"
    }
    catch {
        Write-Host " WARN: error processing $($csv.Name): $($_.Exception.Message) - skipping."
    }
}

Write-Host "Total reviews collected: $($allReviews.Count)"

# --- Step 3: Guard - abort if nothing to send --------------------------------
if ($allReviews.Count -eq 0) {
    Write-Error "0 total reviews collected across all CSVs - aborting before HTTP call."
    exit 1
}

# --- Step 4: Chunk and POST --------------------------------------------------
$reviewArray  = $allReviews.ToArray()
$totalReviews = $reviewArray.Count
$totalChunks  = [int][Math]::Ceiling($totalReviews / $CHUNK_SIZE)

Write-Host "Sending $totalReviews reviews in $totalChunks chunk(s) of up to $CHUNK_SIZE to $BENCHMARK_URL ..."
Write-Host "Export label: $exportLabel"

$lastResponse = $null

for ($i = 0; $i -lt $totalChunks; $i++) {
    $start      = $i * $CHUNK_SIZE
    $end        = [Math]::Min($start + $CHUNK_SIZE, $totalReviews) - 1
    $chunkSlice = $reviewArray[$start..$end]
    $chunkNum   = $i + 1

    Write-Host "  Chunk $chunkNum/$totalChunks ($($chunkSlice.Count) reviews) ..." -NoNewline

    # Build payload with exactly 5 required fields, booleans as [bool]
    $payload = [ordered]@{
        reviews       = $chunkSlice
        enable_ai     = [bool]$true
        fixtures      = [bool]$false
        export_report = [bool]$true
        export_label  = $exportLabel
    } | ConvertTo-Json -Depth 10 -Compress

    $payloadBytes = [System.Text.Encoding]::UTF8.GetBytes($payload)

    try {
        $response = Invoke-WebRequest `
            -Uri $BENCHMARK_URL `
            -Method POST `
            -Headers @{
                "Authorization" = $AUTH_TOKEN
                "Content-Type"  = "application/json"
            } `
            -Body $payloadBytes `
            -TimeoutSec $TIMEOUT_SEC `
            -UseBasicParsing

        $lastResponse = $response.Content
        Write-Host " OK"
    }
    catch {
        $errBody = ""
        try {
            $errStream = $_.Exception.Response.GetResponseStream()
            $errBody = (New-Object System.IO.StreamReader($errStream)).ReadToEnd()
        } catch {}
        Write-Host " FAILED: $($_.Exception.Message) | body: $errBody"
        Write-Error "Chunk $chunkNum failed - aborting."
        exit 1
    }
}

# --- Step 5: Save last chunk response ----------------------------------------
if ($lastResponse) {
    $lastResponse | Out-File -FilePath $outputFile -Encoding utf8 -Force
    Write-Host "SUCCESS - result saved to: $outputFile"
} else {
    Write-Error "No response captured - output file not written."
    exit 1
}
