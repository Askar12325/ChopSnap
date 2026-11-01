const fs = require('fs');

const hookCode = fs.readFileSync('frontend/src/features/chopsnap/hooks/useChopSnapState.ts', 'utf-8');
const returnIdx = hookCode.lastIndexOf('return {');
const returnBlock = hookCode.slice(returnIdx);
const returnMatch = returnBlock.match(/return\s*\{([\s\S]+?)\};/);
const hookProps = returnMatch[1]
  .split('\n')
  .map(l => l.replace(/\/\/.*$/, '').trim().replace(/,$/, ''))
  .filter(Boolean);

console.log('Hook props count:', hookProps.length);

function checkMissing(name, filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ifaceMatch = code.match(/export interface \w+Props\s*\{([\s\S]+?)\}/);
  const ifaceText = ifaceMatch ? ifaceMatch[1] : '';
  const missing = [];
  hookProps.forEach(prop => {
    const bodyRegex = new RegExp('\\b' + prop + '\\b');
    const bodyCode = code.slice(code.indexOf('export function'));
    if (bodyRegex.test(bodyCode)) {
      const ifaceRegex = new RegExp('\\b' + prop + '\\b');
      if (!ifaceRegex.test(ifaceText)) {
        missing.push(prop);
      }
    }
  });
  console.log(`=== Missing props in ${name} ===`, missing);
}

checkMissing('HeroSection', 'frontend/src/features/chopsnap/screens/HeroSection.tsx');
checkMissing('ReviewScreen', 'frontend/src/features/chopsnap/screens/ReviewScreen.tsx');
checkMissing('ResultsScreen', 'frontend/src/features/chopsnap/screens/ResultsScreen.tsx');
checkMissing('Header', 'frontend/src/features/chopsnap/components/Header.tsx');
checkMissing('ActiveScanBar', 'frontend/src/features/chopsnap/components/ActiveScanBar.tsx');
checkMissing('Footer', 'frontend/src/features/chopsnap/components/Footer.tsx');
