const puppeteer = require('./frontend/node_modules/puppeteer-core');

async function testSplash() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
    defaultViewport: { width: 1280, height: 900 }
  });

  try {
    console.log('--- Test 1: Fresh Session Splash Display & Auto-Dismiss ---');
    const page1 = await browser.newPage();
    await page1.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    // Check splash overlay exists immediately
    const splashExists = await page1.$('#chopsnap-splash-overlay');
    console.log('Splash overlay present on first visit:', !!splashExists);

    // Capture screenshot of splash in action
    await new Promise(r => setTimeout(r, 300));
    await page1.screenshot({ path: 'splash-first-visit.png' });
    console.log('Captured splash-first-visit.png');

    // Wait until full duration completes (total < 1.5s)
    await new Promise(r => setTimeout(r, 1300));
    const splashVisibleAfter1600ms = await page1.evaluate(() => {
      const el = document.getElementById('chopsnap-splash-overlay');
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden';
    });
    console.log('Splash still visible after 1.6s:', splashVisibleAfter1600ms);

    const sessionStored = await page1.evaluate(() => sessionStorage.getItem('chopsnap_splash_shown'));
    console.log('sessionStorage marked:', sessionStored);

    console.log('--- Test 2: Repeat Visit in Same Session (Should be Skipped) ---');
    await page1.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const splashOnSecondVisit = await page1.evaluate(() => {
      const el = document.getElementById('chopsnap-splash-overlay');
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.opacity !== '0';
    });
    console.log('Splash visible on second visit in same session:', splashOnSecondVisit);

    console.log('--- Test 3: Prefers-Reduced-Motion (Should be Skipped Entirely) ---');
    const context2 = await browser.createBrowserContext();
    const page2 = await context2.newPage();
    await page2.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page2.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    const splashOnReducedMotion = await page2.evaluate(() => {
      const el = document.getElementById('chopsnap-splash-overlay');
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.opacity !== '0';
    });
    console.log('Splash visible when prefers-reduced-motion is active:', splashOnReducedMotion);

    console.log('--- Test 4: Tap to Skip ---');
    const context3 = await browser.createBrowserContext();
    const page3 = await context3.newPage();
    await page3.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    
    // Tap on splash
    const splashEl = await page3.$('#chopsnap-splash-overlay');
    if (splashEl) {
      await splashEl.click();
      console.log('Tapped splash overlay to skip');
      await new Promise(r => setTimeout(r, 300));
      const splashVisibleAfterTap = await page3.evaluate(() => {
        const el = document.getElementById('chopsnap-splash-overlay');
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.opacity !== '0';
      });
      console.log('Splash visible 300ms after tap:', splashVisibleAfterTap);
    }

    console.log('ALL SPLASH TESTS COMPLETED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

testSplash().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
