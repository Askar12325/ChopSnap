const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function testHealth() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
  });

  await page.setRequestInterception(true);
  page.on("request", req => {
    if (req.url().includes("/api/health")) {
      console.log("INTERCEPTED /api/health -> ABORTING!");
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 1000));

  const text = await page.evaluate(() => document.body.innerText);
  console.log("Includes 'Offline'?", text.includes("Offline"));
  console.log("Header snippet:", text.slice(0, 300));

  await browser.close();
}

testHealth().catch(console.error);
