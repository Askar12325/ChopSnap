const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function testTabs() {
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

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1200));

  // Load sample
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes("Lagos Market Haul")) {
      await b.click();
      break;
    }
  }

  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.some(b => b.textContent && b.textContent.includes("Confirm and cook"));
  }, { timeout: 10000 });

  const confirmBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.find(b => b.textContent && b.textContent.includes("Confirm and cook"));
  });
  if (confirmBtn && confirmBtn.asElement()) {
    await confirmBtn.asElement().click();
  }

  await page.waitForFunction(() => {
    const text = document.body.innerText;
    return text.includes("Quick Meals (≤20m)");
  }, { timeout: 20000 });
  console.log("On results page!");

  const tabButtons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.map(b => b.textContent.trim().replace(/\s+/g, ' ')).filter(t => t.includes("Quick") || t.includes("Proper") || t.includes("Ingredient") || t.includes("Shopping"));
  });
  console.log("Found tab buttons:", tabButtons);

  // Click All Ingredients tab
  const clickedIng = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes("Ingredients"));
    if (b) {
      b.click();
      return true;
    }
    return false;
  });
  console.log("Clicked Ingredients tab?", clickedIng);
  await new Promise(r => setTimeout(r, 500));
  const hasIng = await page.evaluate(() => document.body.innerText.includes("Spotted from your kitchen photo"));
  console.log("Has Ingredients view?", hasIng);

  // Click Shopping List tab
  const clickedShop = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const b = btns.find(btn => btn.textContent && btn.textContent.includes("Shopping"));
    if (b) {
      b.click();
      return true;
    }
    return false;
  });
  console.log("Clicked Shopping tab?", clickedShop);
  await new Promise(r => setTimeout(r, 500));
  const hasShop = await page.evaluate(() => document.body.innerText.includes("Minimal Missing Items"));
  console.log("Has Shopping view?", hasShop);

  await browser.close();
}

testTabs().catch(console.error);
