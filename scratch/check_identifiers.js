const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  // Simple check using esprima or @babel/parser if available, or regex
  // Let's use node's vm or standard regex
  console.log('Checking', filePath);
}

const files = [
  'frontend/src/features/chopsnap/screens/HeroSection.tsx',
  'frontend/src/features/chopsnap/screens/ReviewScreen.tsx',
  'frontend/src/features/chopsnap/screens/ResultsScreen.tsx',
  'frontend/src/features/chopsnap/screens/LoadingScreen.tsx',
  'frontend/src/features/chopsnap/screens/TryExampleSection.tsx',
  'frontend/src/features/chopsnap/screens/HowItWorksSection.tsx',
  'frontend/src/features/chopsnap/components/Header.tsx',
  'frontend/src/features/chopsnap/components/ActiveScanBar.tsx',
  'frontend/src/features/chopsnap/components/Footer.tsx',
  'frontend/src/features/chopsnap/components/OpenWeightModal.tsx',
];

// In HeroSection:
const heroCode = fs.readFileSync('frontend/src/features/chopsnap/screens/HeroSection.tsx', 'utf-8');
// Check if statusStep is in props:
console.log('statusStep in HeroSection props?', heroCode.includes('statusStep:'));
