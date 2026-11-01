const fs = require('fs');

const pageContent = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
const lines = pageContent.split(/\r?\n/);

console.log('Line 906:', lines[905]); // export default function Home() {
console.log('Line 2077:', lines[2076]); // const somePricesUnavailable = unpricedItemsCount > 0;
console.log('Line 2078:', lines[2077]); // return (
