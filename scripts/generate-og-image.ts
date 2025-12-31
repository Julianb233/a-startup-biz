/**
 * Generate OG Image for A Startup Biz
 * Creates a 1200x630px social sharing image with proper branding
 */

import sharp from 'sharp';
import { join } from 'path';

const WIDTH = 1200;
const HEIGHT = 630;
const BRAND_COLOR = '#ff6a1a'; // Orange
const DARK_BG = '#0a0a0a';
const GRADIENT_END = '#1a1a2e';

async function generateOGImage() {
  const publicDir = join(process.cwd(), 'public', 'images');
  const logoPath = join(publicDir, 'a-startup-biz-logo.webp');
  const outputPath = join(publicDir, 'og-image-new.png');

  console.log('🎨 Generating OG image for A Startup Biz...');

  try {
    // Read and resize logo
    const logoBuffer = await sharp(logoPath)
      .resize(400, null, { fit: 'contain', withoutEnlargement: true })
      .toBuffer();

    const logoMetadata = await sharp(logoBuffer).metadata();
    const logoWidth = logoMetadata.width || 400;
    const logoHeight = logoMetadata.height || 100;

    // Create gradient background SVG
    const backgroundSvg = `
      <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${DARK_BG};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${GRADIENT_END};stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Background gradient -->
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)"/>

        <!-- Decorative circles with orange accent -->
        <circle cx="100" cy="100" r="150" fill="${BRAND_COLOR}" opacity="0.05"/>
        <circle cx="${WIDTH - 100}" cy="${HEIGHT - 100}" r="200" fill="${BRAND_COLOR}" opacity="0.08"/>

        <!-- Orange accent line -->
        <rect x="0" y="0" width="8" height="${HEIGHT}" fill="${BRAND_COLOR}"/>

        <!-- Tagline text -->
        <text
          x="${WIDTH / 2}"
          y="${HEIGHT - 120}"
          font-family="Arial, sans-serif"
          font-size="32"
          font-weight="600"
          fill="white"
          text-anchor="middle"
          opacity="0.9"
        >
          Are You an Entrepreneur or Wantrepreneur?
        </text>

        <!-- Subtitle -->
        <text
          x="${WIDTH / 2}"
          y="${HEIGHT - 70}"
          font-family="Arial, sans-serif"
          font-size="24"
          fill="${BRAND_COLOR}"
          text-anchor="middle"
          font-weight="500"
        >
          Business Insurance Made Simple
        </text>

        <!-- Decorative bottom line -->
        <rect x="200" y="${HEIGHT - 30}" width="${WIDTH - 400}" height="3" fill="${BRAND_COLOR}" opacity="0.5"/>
      </svg>
    `;

    // Compose the final image
    const backgroundBuffer = Buffer.from(backgroundSvg);

    const image = sharp(backgroundBuffer)
      .composite([
        {
          input: logoBuffer,
          top: Math.floor((HEIGHT - logoHeight) / 2) - 80, // Position logo in upper-center
          left: Math.floor((WIDTH - logoWidth) / 2),
        }
      ])
      .png();

    await image.toFile(outputPath);

    console.log('✅ OG image generated successfully!');
    console.log(`📍 Location: ${outputPath}`);
    console.log(`📐 Dimensions: ${WIDTH}x${HEIGHT}px`);

    // Generate metadata
    const metadata = await sharp(outputPath).metadata();
    console.log(`📊 File size: ${(metadata.size! / 1024).toFixed(2)}KB`);
    console.log(`🎨 Format: ${metadata.format}`);

  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    throw error;
  }
}

// Run the generator
generateOGImage()
  .then(() => {
    console.log('\n🎉 OG image generation complete!');
    console.log('💡 Next steps:');
    console.log('   1. Review the image at public/images/og-image-new.png');
    console.log('   2. If satisfied, rename to og-image.png');
    console.log('   3. Update metadata in layout.tsx if needed');
  })
  .catch((error) => {
    console.error('\n💥 Failed to generate OG image');
    process.exit(1);
  });
