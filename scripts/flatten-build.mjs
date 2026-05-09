import fs from 'fs';
import path from 'path';

const src = '.open-next';
const dest = 'out';

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  
  const items = fs.readdirSync(srcDir);
  
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    
    try {
      // Dapatkan status file tanpa mengikuti link terlebih dahulu
      const stat = fs.lstatSync(srcPath);
      
      if (stat.isSymbolicLink()) {
        try {
          // Ikuti link ke file aslinya
          const realPath = fs.realpathSync(srcPath);
          const realStat = fs.statSync(realPath);
          
          if (realStat.isDirectory()) {
            copyRecursive(realPath, destPath);
          } else {
            fs.copyFileSync(realPath, destPath);
          }
        } catch (e) {
          // Abaikan link yang rusak (dangling symlinks)
          console.warn(`[WARN] Skipping broken link: ${srcPath}`);
        }
      } else if (stat.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (e) {
      console.warn(`[WARN] Could not copy ${srcPath}: ${e.message}`);
    }
  }
}

console.log(`Starting to flatten build from ${src} to ${dest}...`);

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

if (!fs.existsSync(src)) {
  console.error(`Error: Source directory ${src} not found!`);
  process.exit(1);
}

copyRecursive(src, dest);

// Rename worker.js to _worker.js for Cloudflare Pages
const oldWorker = path.join(dest, 'worker.js');
const newWorker = path.join(dest, '_worker.js');

if (fs.existsSync(oldWorker)) {
  fs.renameSync(oldWorker, newWorker);
  console.log(`Successfully renamed worker.js to _worker.js`);
} else {
  console.warn(`[WARN] worker.js not found in ${dest}`);
}

console.log('Flattening build complete!');
