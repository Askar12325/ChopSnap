const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function testVoice() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("chopsnap_splash_shown", "true");
    // Emulate browser without speech recognition so fallback textarea is shown
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
  });

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1200));

  const textarea = await page.$("textarea");
  console.log("Found textarea in fallback mode?", Boolean(textarea));
  if (textarea) {
    await textarea.type("budget 3000 for 4 people");
    const applyBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      return btns.find(b => b.textContent && (b.textContent.includes("Apply") || b.textContent.includes("Interpret")));
    });
    console.log("Found apply button?", Boolean(applyBtn.asElement()));
    if (applyBtn.asElement()) {
      await applyBtn.asElement().click();
      console.log("Clicked apply! Waiting for voice applied banner...");
      await page.waitForFunction(() => {
        const text = document.body.innerText;
        return text.includes("Voice changes applied") || text.includes("Undo") || text.includes("Applied");
      }, { timeout: 10000 });
      console.log("Voice applied successfully!");

      const undoBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        return btns.find(b => b.textContent && b.textContent.includes("Undo"));
      });
      console.log("Found undo button?", Boolean(undoBtn.asElement()));
      if (undoBtn.asElement()) {
        await undoBtn.asElement().click();
        console.log("Clicked undo! Voice state restored.");
      }
    }
  }

  await browser.close();
}

testVoice().catch(console.error);
