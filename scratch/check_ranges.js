const fs = require('fs');
const lines = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8').split(/\r?\n/);

function showRange(name, start1Based, end1Based) {
  console.log(`=== ${name} (${start1Based} - ${end1Based}) ===`);
  console.log('START:', lines[start1Based - 1]);
  console.log('END:  ', lines[end1Based - 1]);
}

showRange('Header', 2086, 2171);
showRange('ActiveScanBar', 2174, 2211);
showRange('HeroSection', 2218, 2786);
showRange('HowItWorks', 2794, 2850);
showRange('TryExample', 2858, 2935);
showRange('ReviewScreen', 2944, 2955); // check start
showRange('ReviewScreenEnd', 3205, 3217);
showRange('LoadingScreen', 3220, 3300);
showRange('ResultsScreen', 3303, 3315);
showRange('ResultsScreenEnd', 4185, 4198);
showRange('Footer', 4203, 4241);
showRange('OpenWeightModal', 4244, 4324);
