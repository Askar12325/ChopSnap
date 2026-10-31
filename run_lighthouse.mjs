import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function run() {
  const chrome = await chromeLauncher.launch({
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);
  await chrome.kill();

  const report = runnerResult.lhr;
  const perfScore = Math.round(report.categories.performance.score * 100);
  const metrics = {
    score: perfScore,
    fcp: report.audits['first-contentful-paint']?.displayValue,
    lcp: report.audits['largest-contentful-paint']?.displayValue,
    tbt: report.audits['total-blocking-time']?.displayValue,
    cls: report.audits['cumulative-layout-shift']?.displayValue,
    si: report.audits['speed-index']?.displayValue,
  };

  console.log('LIGHTHOUSE_RESULT:', JSON.stringify(metrics, null, 2));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
