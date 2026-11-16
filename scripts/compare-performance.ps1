#Requires -Version 7
param(
  [ValidatePattern('^[a-z0-9-]+$')][string]$Phase = 'paired',
  [ValidateRange(2,8)][ValidateScript({ $_ % 2 -eq 0 })][int]$Runs = 4,
  [ValidateSet('base','current','optimized')][string[]]$Variants = @('base','current'),
  [ValidateSet('/en','/en/career','/en/dev-experience','/en/publications')][string[]]$Routes = @('/en','/en/career','/en/dev-experience','/en/publications')
)
$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot '../.ai/test-results/perf-recheck'
$output = Join-Path $root $Phase
if (Test-Path $output) { throw 'Use a new phase; measurements are never overwritten' }
New-Item -ItemType Directory -Path $output | Out-Null
$ports = @{ base=3101; current=3102; optimized=3103 }
$browserPath = corepack pnpm exec node scripts/summarize-performance.mjs --browser-path
if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve pinned Chromium' }
$env:CHROME_PATH = @($browserPath)[-1].Trim()
if (-not (Test-Path -LiteralPath $env:CHROME_PATH -PathType Leaf)) { throw 'Pinned Chromium does not exist' }
foreach ($variant in $Variants) { foreach ($route in $Routes) {
  $response = Invoke-WebRequest "http://localhost:$($ports[$variant])$route" -UseBasicParsing
  if ($response.StatusCode -ne 200) { throw "Warmup failed: $variant $route" }
} }
$results = @()
for ($run = 1; $run -le $Runs; $run++) {
  foreach ($route in $Routes) {
    $order = @($Variants)
    if ($run % 2 -eq 0) { [array]::Reverse($order) }
    foreach ($variant in $order) {
      $reportPath = Join-Path $output "$variant-$($route.Trim('/').Replace('/','-'))-$run.json"
      $url = "http://localhost:$($ports[$variant])$route"
      corepack pnpm --config.minimumReleaseAge=10080 dlx lighthouse@12.8.2 $url '--chrome-flags=--headless --disable-extensions' '--only-categories=performance' --output=json "--output-path=$reportPath" --quiet
      if ($LASTEXITCODE -ne 0) { throw "Lighthouse failed: $url" }
      $r = Get-Content $reportPath -Raw | ConvertFrom-Json
      if ($r.runtimeError) { throw $r.runtimeError.message }
      $row = [ordered]@{ variant=$variant; route=$route; run=$run; score=$r.categories.performance.score; lcpMs=$r.audits.'largest-contentful-paint'.numericValue; tbtMs=$r.audits.'total-blocking-time'.numericValue; cls=$r.audits.'cumulative-layout-shift'.numericValue; benchmarkIndex=$r.environment.benchmarkIndex; userAgent=$r.environment.hostUserAgent; lighthouse=$r.lighthouseVersion; settings=$r.configSettings; source=[IO.Path]::GetRelativePath((Get-Location).Path,$reportPath).Replace('\','/') }
      $results += $row
      ConvertTo-Json -InputObject $results -Depth 8 | Set-Content (Join-Path $output 'summary.json') -Encoding utf8
      Write-Output "$Phase round=$run $variant $route score=$($row.score) LCP=$([math]::Round($row.lcpMs)) TBT=$([math]::Round($row.tbtMs)) benchmark=$($row.benchmarkIndex)"
    }
  }
}
