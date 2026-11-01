const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function debugFlow1() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));

  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    localStorage.setItem("chopsnap_theme", "light");
  });

  await page.setViewport({ width: 1366, height: 900 });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1500));

  console.log("Looking for buttons...");
  const buttons = await page.$$("button");
  console.log("Found buttons count:", buttons.length);

  let clicked = false;
  for (const b of buttons) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes("Lagos Market Haul")) {
      console.log("Found Lagos Market Haul button! Clicking...");
      await b.click();
      clicked = true;
      break;
    }
  }

  console.log("Clicked:", clicked);
  await new Promise(r => setTimeout(r, 2000));

  const text = await page.evaluate(() => document.body.innerText);
  console.log("Page text contains 'Active Recipes':", text.includes("Active Recipes"));
  console.log("Page text contains 'Quick Meals':", text.includes("Quick Meals"));
  console.log("Page text contains 'Lagos Market Haul':", text.includes("Lagos Market Haul"));
  console.log("Page text snippet:", text.slice(0, 500));

  await browser.close();
}

debugFlow1().catch(console.error);
