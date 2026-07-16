const sharp = require('sharp');
const fs = require('fs');

async function processLogo() {
  try {
    const input = 'public/vms.logo.webp';
    
    // Compress main logo to save size
    await sharp(input)
      .resize({ width: 200 }) // Logo doesn't need to be huge
      .webp({ quality: 80, effort: 6 })
      .toFile('src/assets/images/vms.logo.min.webp');
      
    // Favicon 16x16
    await sharp(input)
      .resize(16, 16)
      .png()
      .toFile('public/favicon-16x16.png');
      
    // Favicon 32x32
    await sharp(input)
      .resize(32, 32)
      .png()
      .toFile('public/favicon-32x32.png');
      
    // Apple Touch Icon 180x180
    await sharp(input)
      .resize(180, 180)
      .png()
      .toFile('public/apple-touch-icon.png');
      
    // Android 192x192
    await sharp(input)
      .resize(192, 192)
      .png()
      .toFile('public/android-chrome-192x192.png');
      
    // Android 512x512
    await sharp(input)
      .resize(512, 512)
      .png()
      .toFile('public/android-chrome-512x512.png');
      
    // favicon.ico (fallback)
    fs.copyFileSync('public/favicon-32x32.png', 'public/favicon.ico');
    
    console.log("Done generating favicons and compressed logo!");
  } catch (error) {
    console.error("Error processing logo:", error);
  }
}

processLogo();
