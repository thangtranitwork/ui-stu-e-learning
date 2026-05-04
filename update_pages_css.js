const fs = require('fs');
const path = require('path');

const pagesDir = 'd:/Coding/React/ui-stu-e-learning/src/pages';

const glassmorphismStyle = `
  background: var(--glass-bg) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  border-radius: 16px;
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove old border-radius that might conflict
  content = content.replace(/border-radius:\s*[0-9]+px;/g, '');

  // Add glassmorphism where there was a solid background
  content = content.replace(/background-color:\s*var\(--white\);/g, glassmorphismStyle.trim());
  content = content.replace(/background-color:\s*#ffffff;/g, glassmorphismStyle.trim());
  content = content.replace(/background-color:\s*#fff;/g, glassmorphismStyle.trim());
  
  // If no background color exists in the wrapper, we might not catch it, but let's try to find '.wrapper {' or '.container {'
  if (!content.includes('var(--glass-bg)')) {
    content = content.replace(/\.wrapper\s*\{/, '.wrapper {\n  ' + glassmorphismStyle.trim());
    content = content.replace(/\.courses-container\s*\{/, '.courses-container {\n  ' + glassmorphismStyle.trim());
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile() && filePath.endsWith('.module.scss') && !filePath.includes('Home.module.scss') && !filePath.includes('Admin.module.scss')) {
      callback(filePath);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

walkSync(pagesDir, processFile);
