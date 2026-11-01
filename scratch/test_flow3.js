const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function debugFlow3() {
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
  await new Promise(r => setTimeout(r, 1200));

  // Click Lagos Market Haul
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes("Lagos Market Haul")) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1500));
  const confirmBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find(b => b.textContent && b.textContent.includes("Confirm and cook"));
  });

  if (confirmBtn && confirmBtn.asElement()) {
    console.log("Clicking Confirm and cook...");
    await confirmBtn.asElement().click();
    console.log("Waiting for results screen...");
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes("Quick Meals (≤20m)") || text.includes("Active Recipes") || text.includes("Zero-Waste Pantry Value");
    }, { timeout: 30000 });
    console.log("Results screen fully mounted!");
    const text = await page.evaluate(() => document.body.innerText);
    console.log("Has Zero-Waste Pantry Value?", text.includes("Zero-Waste Pantry Value"));
    console.log("Has Quick Meals (≤20m)?", text.includes("Quick Meals (≤20m)"));
  }

  await browser.close();
}

debugFlow3().catch(console.error);
