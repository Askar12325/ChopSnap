const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function test4() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  // 1. Test Light/Dark
  console.log("=== Testing Light/Dark ===");
  const pTheme = await browser.newPage();
  pTheme.on("console", m => console.log("Theme LOG:", m.text()));
  pTheme.on("pageerror", e => console.log("Theme ERR:", e.message));
  await pTheme.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    localStorage.setItem("chopsnap_theme", "light");
  });
  await pTheme.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1200));

  const initialClass = await pTheme.evaluate(() => document.documentElement.className);
  console.log("Initial html class:", initialClass);

  const btn = await pTheme.$("button[aria-label='Toggle theme']");
  console.log("Found theme toggle button?", Boolean(btn));
  if (btn) {
    await btn.click();
    await new Promise(r => setTimeout(r, 500));
    const nextClass = await pTheme.evaluate(() => document.documentElement.className);
    console.log("Next html class:", nextClass);
    await btn.click();
    await new Promise(r => setTimeout(r, 500));
    const revertClass = await pTheme.evaluate(() => document.documentElement.className);
    console.log("Revert html class:", revertClass);
  }

  // 2. Test Voice Apply and Undo
  console.log("\n=== Testing Voice Apply and Undo ===");
  const pVoice = await browser.newPage();
  pVoice.on("console", m => console.log("Voice LOG:", m.text()));
  pVoice.on("pageerror", e => console.log("Voice ERR:", e.message));
  await pVoice.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    localStorage.setItem("chopsnap_theme", "light");
  });
  await pVoice.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1200));

  const voiceInput = await pVoice.$("input[placeholder*='budget'], input[placeholder*='Eg:']");
  console.log("Found voice input?", Boolean(voiceInput));
  if (voiceInput) {
    await voiceInput.type("budget 2000 for 4 people");
    // Find Apply button
    const applyBtn = await pVoice.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find(b => b.textContent && (b.textContent.includes("Apply") || b.textContent.includes("Interpret")));
    });
    console.log("Found apply button?", Boolean(applyBtn.asElement()));
    if (applyBtn.asElement()) {
      await applyBtn.asElement().click();
      console.log("Clicked apply! Waiting 2s...");
      await new Promise(r => setTimeout(r, 2000));
      const bodyText = await pVoice.evaluate(() => document.body.innerText);
      console.log("Body has 'applied' or 'Undo'?", bodyText.includes("Undo"), bodyText.includes("applied"));
    }
  }

  // 3. Test Offline Health Pill
  console.log("\n=== Testing Offline Pill ===");
  const pHealth = await browser.newPage();
  await pHealth.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
  });
  await pHealth.setRequestInterception(true);
  pHealth.on("request", req => {
    if (req.url().includes("/api/health")) {
      req.abort();
    } else {
      req.continue();
    }
  });
  await pHealth.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 2000));
  const healthText = await pHealth.evaluate(() => document.body.innerText);
  console.log("Has 'Offline'?", healthText.includes("Offline"));

  await browser.close();
}

test4().catch(console.error);
