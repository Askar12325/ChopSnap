const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/PC/.gemini/antigravity/brain/b51567d3-5e2b-4462-8037-74f20bde3c3c';

const pairs = [
  ['before_home_light.png', 'after_home_light.png'],
  ['before_home_dark.png', 'after_home_dark.png'],
  ['before_results_light.png', 'after_results_light.png'],
  ['before_results_dark.png', 'after_results_dark.png']
];

pairs.forEach(([bName, aName]) => {
  const bPath = path.join(dir, bName);
  const aPath = path.join(dir, aName);
  const bBuf = fs.readFileSync(bPath);
  const aBuf = fs.readFileSync(aPath);
  console.log(`${bName} (${bBuf.length} B) vs ${aName} (${aBuf.length} B)`);
  if (bBuf.equals(aBuf)) {
    console.log(`  -> EXACT 100% BYTE-FOR-BYTE IDENTICAL`);
  } else {
    // Compare byte differences
    let diffCount = 0;
    const minLen = Math.min(bBuf.length, aBuf.length);
    for (let i = 0; i < minLen; i++) {
      if (bBuf[i] !== aBuf[i]) diffCount++;
    }
    const byteDiffPercent = ((Math.abs(bBuf.length - aBuf.length) + diffCount) / Math.max(bBuf.length, aBuf.length) * 100).toFixed(2);
    console.log(`  -> Byte difference: ${byteDiffPercent}%, size diff: ${aBuf.length - bBuf.length} bytes`);
  }
});
