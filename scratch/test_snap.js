const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const path = require("path");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = "C:\\Users\\PC\\.gemini\\antigravity\\brain\\b51567d3-5e2b-4462-8037-74f20bde3c3c";

async function snap() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  // Results Light
  const pResLight = await browser.newPage();
  await pResLight.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    localStorage.setItem("chopsnap_theme", "light");
  });
  await pResLight.setViewport({ width: 1366, height: 900 });
  await pResLight.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1000));
  const buttons = await pResLight.$$("button");
  for (const b of buttons) {
    const txt = await pResLight.evaluate(el => el.textContent, b);
    if (txt && txt.includes("Lagos Market Haul")) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await pResLight.screenshot({ path: path.join(ARTIFACTS_DIR, "after_results_light.png"), fullPage: false });

  // Results Dark
  const pResDark = await browser.newPage();
  await pResDark.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    localStorage.setItem("chopsnap_theme", "dark");
  });
  await pResDark.setViewport({ width: 1366, height: 900 });
  await pResDark.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1000));
  const buttonsDark = await pResDark.$$("button");
  for (const b of buttonsDark) {
    const txt = await pResDark.evaluate(el => el.textContent, b);
    if (txt && txt.includes("Lagos Market Haul")) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await pResDark.screenshot({ path: path.join(ARTIFACTS_DIR, "after_results_dark.png"), fullPage: false });

  // Home Light
  const pHomeLight = await browser.newPage();
  await pHomeLight.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    localStorage.setItem("chopsnap_theme", "light");
  });
  await pHomeLight.setViewport({ width: 1366, height: 900 });
  await pHomeLight.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1200));
  await pHomeLight.screenshot({ path: path.join(ARTIFACTS_DIR, "after_home_light.png"), fullPage: false });

  // Home Dark
  const pHomeDark = await browser.newPage();
  await pHomeDark.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    localStorage.setItem("chopsnap_theme", "dark");
  });
  await pHomeDark.setViewport({ width: 1366, height: 900 });
  await pHomeDark.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1200));
  await pHomeDark.screenshot({ path: path.join(ARTIFACTS_DIR, "after_home_dark.png"), fullPage: false });

  await browser.close();
  console.log("Snap complete!");
}

snap().catch(console.error);
