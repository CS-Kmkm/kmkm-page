import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
if (process.argv[2] === '--browser-path') {
  process.stdout.write(chromium.executablePath());
} else {
  const phases = process.argv.slice(2);
  const datasets = await Promise.all(phases.map(async phase => {
    const source = await readFile(`.ai/test-results/perf-recheck/${phase}/summary.json`, 'utf8');
    return JSON.parse(source.replace(/^\uFEFF/, '')).map(row => ({ ...row, phase, source: path.isAbsolute(row.source) ? path.relative(process.cwd(), row.source).replaceAll('\\','/') : row.source }));
  }));
  const rows = datasets.flat();
  const median = values => {
    const sorted = [...values].sort((a,b) => a-b);
    const mid = Math.floor(sorted.length/2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
  };
  const grouped = [];
  for (const phase of phases) for (const variant of [...new Set(rows.map(r => r.variant))]) for (const route of [...new Set(rows.map(r => r.route))]) {
    const runs = rows.filter(r => r.phase === phase && r.variant === variant && r.route === route);
    if (!runs.length) continue;
    grouped.push({ phase, variant, route, runs: runs.length, score: median(runs.map(r => r.score)), lcpMs: median(runs.map(r => r.lcpMs)), tbtMs: median(runs.map(r => r.tbtMs)), cls: median(runs.map(r => r.cls)), benchmarkRange: [Math.min(...runs.map(r => r.benchmarkIndex)), Math.max(...runs.map(r => r.benchmarkIndex))] });
  }
  const paired = [];
  for (const phase of phases) {
    const phaseRows = rows.filter(r => r.phase === phase);
    const variants = [...new Set(phaseRows.map(r => r.variant))];
    if (variants.length !== 2) continue;
    for (const route of [...new Set(phaseRows.map(r => r.route))]) {
      const pairs = [...new Set(phaseRows.filter(r => r.route === route).map(r => r.run))].map(run => {
        const left = phaseRows.find(r => r.route === route && r.run === run && r.variant === variants[0]);
        const right = phaseRows.find(r => r.route === route && r.run === run && r.variant === variants[1]);
        if (!left || !right) throw new Error(`Incomplete pair: ${phase} ${route} ${run}`);
        return { run, scoreDelta: right.score-left.score, lcpDeltaMs: right.lcpMs-left.lcpMs, tbtDeltaMs: right.tbtMs-left.tbtMs, benchmarkRatio: right.benchmarkIndex/left.benchmarkIndex };
      });
      paired.push({ phase, route, from: variants[0], to: variants[1], scoreWins: pairs.filter(p => p.scoreDelta > 0).length, scoreLosses: pairs.filter(p => p.scoreDelta < 0).length, medianScoreDelta: median(pairs.map(p => p.scoreDelta)), medianTbtDeltaMs: median(pairs.map(p => p.tbtDeltaMs)), pairs });
    }
  }
  const result = { phases, grouped, paired, rows };
  await writeFile('docs/performance-comparison.json', JSON.stringify(result, null, 2)+'\n');
  console.table(grouped);
}
