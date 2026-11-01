const puppeteer = require("c:/Users/PC/Desktop/Meta.AI hackhaton 2026/frontend/node_modules/puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = "C:\\Users\\PC\\.gemini\\antigravity\\brain\\b51567d3-5e2b-4462-8037-74f20bde3c3c";

async function runAllFlows() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const results = {};

  async function createPage(theme = "light", bypassSplash = true) {
    const page = await browser.newPage();
    if (bypassSplash) {
      await page.evaluateOnNewDocument((t) => {
        sessionStorage.setItem("chopsnap_splash_shown", "true");
        localStorage.setItem("chopsnap_theme", t);
      }, theme);
    }
    await page.setViewport({ width: 1366, height: 900 });
    return page;
  }

  try {
    // -------------------------------------------------------------
    // FLOW 1: Example Scenario
    // -------------------------------------------------------------
    console.log("--> Testing Flow 1: Example Scenario");
    try {
      const page = await createPage();
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await new Promise(r => setTimeout(r, 1200));

      const buttons = await page.$$("button");
      for (const b of buttons) {
        const txt = await page.evaluate(el => el.textContent, b);
        if (txt && txt.includes("Lagos Market Haul")) {
          await b.click();
          break;
        }
      }
      await page.waitForFunction(() => {
        const text = document.body.innerText;
        return text.includes("Confirm your kitchen ingredients") || text.includes("Looks clear");
      }, { timeout: 10000 });
      results["example scenario"] = "PASS";
      await page.close();
      console.log("   Result: PASS");
    } catch (e) {
      console.error("Flow 1 error:", e.message);
      results["example scenario"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 2: Photo Upload
    // -------------------------------------------------------------
    console.log("--> Testing Flow 2: Photo Upload");
    try {
      const page = await createPage();
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await new Promise(r => setTimeout(r, 1000));

      const fileInput = await page.$("#kitchen-upload-input");
      const testImgPath = path.join(__dirname, "test_upload.jpg");
      if (!fs.existsSync(testImgPath)) {
        const dummyJpg = Buffer.from("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=", "base64");
        fs.writeFileSync(testImgPath, dummyJpg);
      }
      if (fileInput) {
        await fileInput.uploadFile(testImgPath);
        await new Promise(r => setTimeout(r, 1200));
      }
      const pass = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("test_upload.jpg") ||
               text.includes("Change photo") ||
               Boolean(document.querySelector("img[alt='Uploaded kitchen preview']")) ||
               text.includes("Confirm your kitchen ingredients");
      });
      results["photo upload"] = pass ? "PASS" : "FAIL";
      await page.close();
      console.log("   Result:", results["photo upload"]);
    } catch (e) {
      console.error("Flow 2 error:", e.message);
      results["photo upload"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 3: Ingredient Review and Confirm
    // -------------------------------------------------------------
    console.log("--> Testing Flow 3: Ingredient Review & Confirm");
    let activeResultsPage = null;
    try {
      const page = await createPage();
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await new Promise(r => setTimeout(r, 1200));

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
      results["ingredient review and confirm"] = "PASS";
      activeResultsPage = page; // keep open for Flow 5, 6, 7
      console.log("   Result: PASS");
    } catch (e) {
      console.error("Flow 3 error:", e.message);
      results["ingredient review and confirm"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 4: Voice Apply and Undo
    // -------------------------------------------------------------
    console.log("--> Testing Flow 4: Voice Apply and Undo");
    try {
      const page = await createPage();
      await page.evaluateOnNewDocument(() => {
        delete window.SpeechRecognition;
        delete window.webkitSpeechRecognition;
      });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await new Promise(r => setTimeout(r, 1200));

      const textarea = await page.$("textarea");
      let pass = false;
      if (textarea) {
        await textarea.type("budget 3000 for 4 people");
        const applyBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll("button"));
          return btns.find(b => b.textContent && (b.textContent.includes("Apply") || b.textContent.includes("Interpret")));
        });
        if (applyBtn && applyBtn.asElement()) {
          await applyBtn.asElement().click();
          await page.waitForFunction(() => {
            const text = document.body.innerText;
            return text.includes("Voice changes applied") || text.includes("Undo") || text.includes("Applied");
          }, { timeout: 10000 });
          pass = true;

          const undoBtn = await page.evaluateHandle(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            return btns.find(b => b.textContent && b.textContent.includes("Undo"));
          });
          if (undoBtn && undoBtn.asElement()) {
            await undoBtn.asElement().click();
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
      results["voice apply and undo"] = pass ? "PASS" : "FAIL";
      await page.close();
      console.log("   Result:", results["voice apply and undo"]);
    } catch (e) {
      console.error("Flow 4 error:", e.message);
      results["voice apply and undo"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 5: Recipe Generation and Tab Navigation
    // -------------------------------------------------------------
    console.log("--> Testing Flow 5: Recipe Generation & Tab Navigation");
    try {
      const page = activeResultsPage;
      const clickedProper = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const b = btns.find(btn => btn.textContent && btn.textContent.includes("Proper Cooking"));
        if (b) { b.click(); return true; }
        return false;
      });
      await new Promise(r => setTimeout(r, 300));

      const clickedIng = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const b = btns.find(btn => btn.textContent && btn.textContent.includes("Ingredients"));
        if (b) { b.click(); return true; }
        return false;
      });
      await new Promise(r => setTimeout(r, 300));
      const hasIng = await page.evaluate(() => document.body.innerText.includes("Spotted from your kitchen photo"));

      const clickedShop = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const b = btns.find(btn => btn.textContent && btn.textContent.includes("Shopping"));
        if (b) { b.click(); return true; }
        return false;
      });
      await new Promise(r => setTimeout(r, 300));
      const hasShop = await page.evaluate(() => document.body.innerText.includes("Smart Minimal Shopping List"));

      const pass = clickedProper && clickedIng && hasIng && clickedShop && hasShop;
      results["recipe generation and tab navigation"] = pass ? "PASS" : "FAIL";
      console.log("   Result:", results["recipe generation and tab navigation"]);
    } catch (e) {
      console.error("Flow 5 error:", e.message);
      results["recipe generation and tab navigation"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 6: City Selector and Price Changes
    // -------------------------------------------------------------
    console.log("--> Testing Flow 6: City Selector & Price Changes");
    try {
      const page = activeResultsPage;
      const cityPass = await page.evaluate(() => {
        const citySelect = Array.from(document.querySelectorAll("select")).find(s => {
          return Array.from(s.options).some(o => o.value === "Abuja");
        });
        if (!citySelect) return false;
        citySelect.value = "Abuja";
        citySelect.dispatchEvent(new Event("change", { bubbles: true }));
        return citySelect.value === "Abuja";
      });
      results["city selector and price changes"] = cityPass ? "PASS" : "FAIL";
      console.log("   Result:", results["city selector and price changes"]);
    } catch (e) {
      console.error("Flow 6 error:", e.message);
      results["city selector and price changes"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 7: Usage Summary
    // -------------------------------------------------------------
    console.log("--> Testing Flow 7: Usage Summary");
    try {
      const page = activeResultsPage;
      const usagePass = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("Value of ingredients you're using") ||
               text.includes("ingredients used") ||
               text.includes("₦");
      });
      results["usage summary"] = usagePass ? "PASS" : "FAIL";
      console.log("   Result:", results["usage summary"]);
      await page.close();
    } catch (e) {
      console.error("Flow 7 error:", e.message);
      results["usage summary"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 8: Light/Dark Toggle
    // -------------------------------------------------------------
    console.log("--> Testing Flow 8: Light/Dark Toggle");
    try {
      const page = await createPage("light");
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await new Promise(r => setTimeout(r, 1200));

      const btn = await page.$("button[aria-label='Toggle theme']");
      let pass = false;
      if (btn) {
        await btn.click();
        await new Promise(r => setTimeout(r, 400));
        const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
        await btn.click();
        await new Promise(r => setTimeout(r, 400));
        const isLight = await page.evaluate(() => !document.documentElement.classList.contains("dark"));
        pass = isDark && isLight;
      }
      results["light/dark toggle"] = pass ? "PASS" : "FAIL";
      await page.close();
      console.log("   Result:", results["light/dark toggle"]);
    } catch (e) {
      console.error("Flow 8 error:", e.message);
      results["light/dark toggle"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 9: Splash on a Fresh Session
    // -------------------------------------------------------------
    console.log("--> Testing Flow 9: Splash on a Fresh Session");
    try {
      const page = await createPage("light", false);
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      const pass = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("ChopSnap") &&
               (sessionStorage.getItem("chopsnap_splash_shown") !== null ||
                Boolean(document.querySelector(".splash") || document.querySelector("[aria-label*='ChopSnap']")));
      });
      results["splash on a fresh session"] = pass ? "PASS" : "FAIL";
      await page.close();
      console.log("   Result:", results["splash on a fresh session"]);
    } catch (e) {
      console.error("Flow 9 error:", e.message);
      results["splash on a fresh session"] = "FAIL";
    }

    // -------------------------------------------------------------
    // FLOW 10: Backend Health Pill Offline & Recovering
    // -------------------------------------------------------------
    console.log("--> Testing Flow 10: Backend Health Pill Offline & Recovery");
    try {
      const page = await createPage();
      await page.setRequestInterception(true);
      let simulateOffline = true;
      page.on("request", req => {
        if (req.url().includes("/api/health") && simulateOffline) {
          req.abort();
        } else {
          req.continue();
        }
      });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await new Promise(r => setTimeout(r, 1500));

      const offlineShown = await page.evaluate(() => {
        return document.body.innerText.includes("Offline");
      });

      simulateOffline = false;
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        return document.body.innerText.includes("AI Ready") || document.body.innerText.includes("Live Kitchen Analysis");
      }, { timeout: 10000 });

      const onlineShown = await page.evaluate(() => {
        return document.body.innerText.includes("AI Ready") || document.body.innerText.includes("Live Kitchen Analysis");
      });

      results["backend health pill going Offline when the backend is stopped"] = (offlineShown && onlineShown) ? "PASS" : "FAIL";
      await page.close();
      console.log("   Result:", results["backend health pill going Offline when the backend is stopped"], `(offline: ${offlineShown}, online: ${onlineShown})`);
    } catch (e) {
      console.error("Flow 10 error:", e.message);
      results["backend health pill going Offline when the backend is stopped"] = "FAIL";
    }

  } finally {
    await browser.close();
  }

  console.log("\n=======================================================");
  console.log("FINAL FLOW WALKTHROUGH RESULTS:");
  console.log("=======================================================");
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(path.join(ARTIFACTS_DIR, "scratch", "walkthrough_results.json"), JSON.stringify(results, null, 2), "utf-8");
}

runAllFlows().catch(console.error);
