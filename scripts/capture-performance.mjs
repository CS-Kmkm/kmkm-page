import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const browser = await chromium.launch();
const output = '.ai/test-results/perf-recheck/visuals';
await mkdir(output, { recursive: true });
const results = [];
const nonHome = [];
try {
  for (const [variant, port] of [['current',3102],['optimized',3103]]) {
    for (const locale of ['ja','en']) for (const theme of ['light','dark']) for (const width of [375,1440]) {
      const context = await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__observerCount = 0;
        window.PerformanceObserver = new Proxy(window.PerformanceObserver, {
          construct(target, args) {
            window.__observerCount++;
            return Reflect.construct(target, args);
          },
        });
      });
      await page.goto(`http://localhost:${port}/${locale}`, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      if (variant === 'optimized') await page.locator('[data-update-fit="settled"]').waitFor();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.screenshot({path:`${output}/${variant}-${locale}-${theme}-${width}.png`,fullPage:true});
      results.push({variant,locale,theme,width,...await page.evaluate(() => ({
        nodes:document.querySelectorAll('*').length,
        fit:document.querySelector('[data-update-fit]')?.getAttribute('data-update-fit'),
        observers:window.__observerCount,
        measured:document.querySelectorAll('[data-update-measure-item]').length,
        visible:document.querySelectorAll('[data-visible-update-item]').length,
        more:document.querySelector('[data-visible-update-more]')?.textContent,
        scrollWidth:document.documentElement.scrollWidth,
        scripts:performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script').map(r => ({url:r.name,bytes:r.encodedBodySize})),
      }))});
      await context.close();
    }
  }
  for (const route of ['/en/career','/en/dev-experience','/en/publications']) {
    for (const [variant, port] of [['current',3102],['optimized',3103]]) {
      const context = await browser.newContext({viewport:{width:375,height:1000}});
      const page = await context.newPage();
      await page.goto(`http://localhost:${port}${route}`, {waitUntil:'networkidle'});
      const urls = await page.locator('script[src]').evaluateAll(scripts => scripts.map(s => s.src));
      const assets = [];
      for (const url of urls) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Script unavailable: ${url}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        assets.push({path:new URL(url).pathname,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
      }
      nonHome.push({variant,route,assets});
      await context.close();
    }
  }
} finally { await browser.close(); }
await writeFile(`${output}/results.json`, JSON.stringify(results,null,2));
await writeFile(`${output}/non-home.json`, JSON.stringify(nonHome,null,2));
console.table(results.map(({scripts,...row}) => ({...row,scriptBytes:scripts.reduce((n,r)=>n+r.bytes,0)})));
