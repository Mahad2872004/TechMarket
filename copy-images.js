const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\ADAN\\.gemini\\antigravity\\brain\\85930ca2-8859-450b-baac-0136578da9c5';
const destDir = 'f:\\newolx\\public\\images';

if (!fs.existsSync(srcDir)) {
  console.log('Source directory not found. Skipping image copy (images are already committed to repository).');
  process.exit(0);
}

const files = fs.readdirSync(srcDir);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const targets = [
  { prefix: 'hero_macbook', dest: 'hero_macbook.png' },
  { prefix: 'category_smartphone', dest: 'category_smartphone.png' },
  { prefix: 'category_laptop', dest: 'category_laptop.png' },
  { prefix: 'listing_iphone', dest: 'listing_iphone.png' },
  { prefix: 'listing_macbook', dest: 'listing_macbook.png' },
  { prefix: 'listing_ps5', dest: 'listing_ps5.png' }
];

targets.forEach(target => {
  const match = files.find(f => f.startsWith(target.prefix) && f.endsWith('.png'));
  if (match) {
    const srcPath = path.join(srcDir, match);
    const destPath = path.join(destDir, target.dest);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${match} to ${target.dest}`);
  } else {
    console.log(`No match for ${target.prefix}`);
  }
});
