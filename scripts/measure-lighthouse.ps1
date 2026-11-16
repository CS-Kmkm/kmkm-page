param(
  [ValidatePattern('^[a-z0-9-]+$')][string]$Phase = 'after',
  [ValidateRange(1,5)][int]$Runs = 3
)
$ErrorActionPreference = 'Stop'
$outputRoot = Join-Path $PSScriptRoot "../.ai/test-results/ui-quality/lighthouse-$Phase"
New-Item -ItemType Directory -Force $outputRoot | Out-Null
$urls = (Get-Content (Join-Path $PSScriptRoot '../.lighthouserc.json') -Raw | ConvertFrom-Json).ci.collect.url
foreach ($url in $urls) {
  $name = ([uri]$url).AbsolutePath.Trim('/').Replace('/', '-')
  for ($run = 1; $run -le $Runs; $run++) {
    $reportPath = Join-Path $outputRoot "$name-$run.json"
    corepack pnpm --config.minimumReleaseAge=10080 dlx lighthouse@12.8.2 $url '--chrome-flags=--headless' '--only-categories=performance,accessibility,best-practices,seo' --output=json "--output-path=$reportPath" --quiet
    if ($LASTEXITCODE -ne 0) { throw "Lighthouse failed for $url run $run" }
    $report = Get-Content $reportPath -Raw | ConvertFrom-Json
    if ($report.runtimeError) { throw $report.runtimeError.message }
    Write-Output "$Phase $name run $run perf=$($report.categories.performance.score) LCP=$($report.audits.'largest-contentful-paint'.numericValue) CLS=$($report.audits.'cumulative-layout-shift'.numericValue) TBT=$($report.audits.'total-blocking-time'.numericValue)"
  }
}
