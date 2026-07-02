import fs from 'fs';
import path from 'path';

const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
const lettersDir = path.join(publicAssetsDir, 'letters');
const wordsDir = path.join(publicAssetsDir, 'words');

// Ensure directories exist
[lettersDir, wordsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to generate SVG
const generateSVG = (text, bgColor = '#4f46e5', textColor = '#ffffff') => `
<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="system-ui, sans-serif" 
    font-size="64" 
    font-weight="bold" 
    fill="${textColor}" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >
    ${text}
  </text>
  <text 
    x="50%" 
    y="80%" 
    font-family="system-ui, sans-serif" 
    font-size="24" 
    fill="rgba(255,255,255,0.7)" 
    text-anchor="middle"
  >
    (Placeholder)
  </text>
</svg>
`.trim();

// Generate A-Z
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
letters.forEach(letter => {
  const filePath = path.join(lettersDir, `${letter}.svg`);
  fs.writeFileSync(filePath, generateSVG(`Sign: ${letter}`, '#3b82f6'));
});

// Generate some common words
const words = ['hello', 'please', 'thank you', 'yes', 'no', 'help'];
words.forEach(word => {
  const filePath = path.join(wordsDir, `${word.replace(' ', '_')}.svg`);
  fs.writeFileSync(filePath, generateSVG(`Sign: ${word}`, '#8b5cf6'));
});

console.log('Successfully generated placeholder assets.');
