const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf8');

// Verificações básicas
const checks = [
  { name: 'DOCTYPE', pass: html.includes('<!DOCTYPE html>') },
  { name: 'Lang attribute', pass: html.includes('lang=') },
  { name: 'Meta viewport', pass: html.includes('viewport') },
  { name: 'Stylesheet link', pass: html.includes('/assets/css/styles.css') },
  { name: 'App script', pass: html.includes('/assets/js/app.js') },
  { name: 'Container div', pass: html.includes('id="teams-container"') },
  { name: 'Header', pass: html.includes('<header>') },
  { name: 'Footer', pass: html.includes('<footer>') }
];

console.log('✅ HTML Structure Validation:');
checks.forEach(check => {
  console.log('  ' + (check.pass ? '✓' : '✗') + ' ' + check.name);
});

const allPassed = checks.every(c => c.pass);
process.exit(allPassed ? 0 : 1);
