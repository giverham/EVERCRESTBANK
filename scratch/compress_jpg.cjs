const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = 'c:\\Users\\HP\\OneDrive\\Desktop\\EVERCREST DEMO\\EVERCRESTBANK\\public';

async function compressJpg(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const statsBefore = fs.statSync(filePath);
  console.log(`Compressing ${filename}...`);
  console.log(`Size before: ${(statsBefore.size / 1024).toFixed(2)} KB`);

  try {
    const image = await Jimp.read(filePath);
    // Let's set the quality to 70 (perfect compression for web while maintaining excellent detail)
    // Wait, in Jimp, quality is often a chainable method: image.quality(70)
    if (typeof image.quality === 'function') {
      image.quality(70);
    }
    
    const tempPath = path.join(PUBLIC_DIR, `temp-${filename}`);
    await image.write(tempPath);

    const statsAfter = fs.statSync(tempPath);
    console.log(`Size after quality(70): ${(statsAfter.size / 1024).toFixed(2)} KB`);
    console.log(`Reduction: ${((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1)}%`);

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error compressing ${filename}:`, error);
  }
}

async function run() {
  await compressJpg('hero-banking.jpg');
  await compressJpg('bank-vault.jpg');
}

run();
