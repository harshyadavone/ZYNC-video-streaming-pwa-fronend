// generate icons
import sharp  from 'sharp';


const svgString = `
<svg width="512" height="512" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.5 5 L27.5 5 L2.5 35 L27.5 35" stroke="hsl(142.1, 76.2%, 36.3%)" stroke-width="5" fill="none" />
</svg>
`;

const sizes = [192, 512];

async function generateIcons() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgString))
      .resize(size, size)
      .png()
      .toFile(`public/pwa-${size}x${size}.png`);
  }

  // Generate apple-touch-icon
  await sharp(Buffer.from(svgString))
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);