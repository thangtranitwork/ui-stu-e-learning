const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Coding/React/ui-stu-e-learning/src';

function processJsxFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove SCSS imports
  content = content.replace(/import\s+styles\s+from\s+['"].*\.module\.scss['"];?/g, '');
  
  // Replace cx bind
  content = content.replace(/const\s+cx\s*=\s*classNames\.bind\(styles\);?/g, 'const cx = classNames;');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated JSX: ${filePath}`);
  }
}

function processDirectory(currentDirPath) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      if (filePath.endsWith('.module.scss')) {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
      } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        processJsxFile(filePath);
      }
    } else if (stat.isDirectory()) {
      processDirectory(filePath);
    }
  });
}

// 1. Process all files
processDirectory(srcDir);

// 2. Configure tailwind.config.js
const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
fs.writeFileSync('d:/Coding/React/ui-stu-e-learning/tailwind.config.js', tailwindConfig, 'utf8');

// 3. Inject Tailwind into index.scss or index.css
const globalStylesPath = 'd:/Coding/React/ui-stu-e-learning/src/GlobalStyles/GlobalStyles.scss';
let globalStyles = fs.readFileSync(globalStylesPath, 'utf8');
globalStyles = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n` + globalStyles;
fs.writeFileSync(globalStylesPath, globalStyles, 'utf8');

console.log("Migration script complete!");
