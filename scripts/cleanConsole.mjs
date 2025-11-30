import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src/pages/home-page/client/src/pages/HomePage.tsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Split into lines
const lines = content.split('\n');
const result = [];

let i = 0;
while (i < lines.length) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // If line contains only console statement
  if (trimmed.startsWith('console.') && trimmed.endsWith(';')) {
    i++;
    continue;
  }
  
  // If line starts console but doesn't end with ;, it's multiline
  if (trimmed.startsWith('console.') && !trimmed.includes(';')) {
    // Skip until we find the closing )
    i++;
    while (i < lines.length) {
      const nextLine = lines[i];
      if (nextLine.includes(';')) {
        i++;
        break;
      }
      i++;
    }
    continue;
  }
  
  result.push(line);
  i++;
}

const newContent = result.join('\n');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ Successfully removed all console logs');
