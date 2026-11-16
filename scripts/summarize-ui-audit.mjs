import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = '.ai/test-results/ui-quality';
const summary = { environment: {}, accessibility: {}, lighthouse: {} };
const median = values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
for (const phase of ['before', 'after']) {
  const audit = JSON.parse(await readFile(path.join(root, phase, 'results.json'), 'utf8'));
  summary.environment[phase] = { browser: audit.browser, baseURL: audit.baseURL };
  summary.accessibility[phase] = {
    conditions: audit.results.length,
    conditionsWithViolations: audit.results.filter(r => r.violations.length).length,
    rules: [...new Set(audit.results.flatMap(r => r.violations.map(v => v.id)))],
    pageOverflows: audit.results.filter(r => r.scrollWidth > r.viewport + 1).map(r => r.name),
    clippedSvgText: audit.results.filter(r => r.clippedSvgText.length).map(r => r.name),
  };
  const reports = [];
  for (const file of await readdir(path.join(root, `lighthouse-${phase}`))) {
    if (!file.endsWith('.json')) continue;
    const report = JSON.parse(await readFile(path.join(root, `lighthouse-${phase}`, file), 'utf8'));
    if (report.runtimeError) throw new Error(`${file}: ${report.runtimeError.message}`);
    reports.push(report);
  }
  summary.lighthouse[phase] = [...new Set(reports.map(r => r.requestedUrl))].sort().map(url => {
    const runs = reports.filter(r => r.requestedUrl === url);
    return {
      url, runs: runs.length, lighthouseVersion: runs[0].lighthouseVersion,
      score: median(runs.map(r => r.categories.performance.score)),
      lcpMs: median(runs.map(r => r.audits['largest-contentful-paint'].numericValue)),
      cls: median(runs.map(r => r.audits['cumulative-layout-shift'].numericValue)),
      tbtMs: median(runs.map(r => r.audits['total-blocking-time'].numericValue)),
      accessibility: median(runs.map(r => r.categories.accessibility.score)),
    };
  });
  summary.environment[phase].lighthouse = {
    hostUserAgent: reports[0].environment.hostUserAgent,
    benchmarkIndex: reports[0].environment.benchmarkIndex,
    formFactor: reports[0].configSettings.formFactor,
    throttlingMethod: reports[0].configSettings.throttlingMethod,
    throttling: reports[0].configSettings.throttling,
  };
}
await writeFile('docs/ui-quality-results.json', `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
