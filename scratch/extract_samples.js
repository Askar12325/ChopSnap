const fs = require('fs');
const path = require('path');

const pageContent = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
const lines = pageContent.split(/\r?\n/);

// CLIENT_DEMO_DATA is lines 199 to 904 (1-based), so index 198 to 904
const demoDataLines = lines.slice(198, 904);

// NIGERIAN_SUGGESTIONS is lines 2009 to 2020 (1-based), index 2008 to 2021
const suggestionsLines = lines.slice(2008, 2021);

const outDir = path.join('frontend', 'src', 'features', 'chopsnap', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const content = [
  "import { ProcessResponse } from '../types';",
  "",
  "// NOTE: All demo recipes need review by an authentic Nigerian cook.",
  "// Client-Side Curated Fallback Data",
  "export " + demoDataLines.join('\n'),
  "",
  "export " + suggestionsLines.join('\n').trim(),
  ""
].join('\n');

fs.writeFileSync(path.join(outDir, 'samples.ts'), content, 'utf-8');
console.log('Successfully wrote data/samples.ts');
