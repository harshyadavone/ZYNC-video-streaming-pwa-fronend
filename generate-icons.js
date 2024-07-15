// generate icons
import sharp from "sharp";

const svgString = `
<svg width="512" height="512" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="20" fill="hsl(142.1, 76.2%, 36.3%)"/>
  <path d="M30 30 H70 L30 70 H70" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
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
    .toFile("public/apple-touch-icon.png");

  console.log("Icons generated successfully!");
}

generateIcons().catch(console.error);
