const sharp = require('sharp')
const { readFileSync } = require('fs')
const { join } = require('path')

async function generateFrame () {
  const width = 800
  const height = 1000
  const photoSize = 600
  const photoX = (width - photoSize) / 2
  const photoY = 150

  // Load Cursor logo
  const logoPath = join(process.cwd(), 'public', 'cursor-logo.png')
  const logoBuffer = readFileSync(logoPath)
  
  // Resize logo to fit in header
  const logo = await sharp(logoBuffer)
    .resize(200, 100, { fit: 'inside' })
    .toBuffer()

  // Create frame with transparent photo area
  const svgFrame = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Top section (black background) -->
      <rect width="${width}" height="${photoY}" fill="#000000"/>
      
      <!-- Left side -->
      <rect x="0" y="${photoY}" width="${photoX}" height="${photoSize}" fill="#000000"/>
      
      <!-- Right side -->
      <rect x="${photoX + photoSize}" y="${photoY}" width="${photoX}" height="${photoSize}" fill="#000000"/>
      
      <!-- Bottom section -->
      <rect x="0" y="${photoY + photoSize}" width="${width}" height="${height - photoY - photoSize}" fill="#000000"/>
      
      <!-- Outer white border -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" 
            fill="none" stroke="#ffffff" stroke-width="4" rx="12"/>
      
      <!-- Inner decorative border -->
      <rect x="30" y="30" width="${width - 60}" height="${height - 60}" 
            fill="none" stroke="#ffffff" stroke-width="1" rx="8"/>
      
      <!-- Photo area border -->
      <rect x="${photoX}" y="${photoY}" width="${photoSize}" height="${photoSize}" 
            fill="none" stroke="#ffffff" stroke-width="2" rx="8"/>
      
      <!-- Top decorative line -->
      <line x1="100" y1="130" x2="${width - 100}" y2="130" 
            stroke="#ffffff" stroke-width="1" opacity="0.5"/>
      
      <!-- Bottom decorative line -->
      <line x1="100" y1="${photoY + photoSize + 20}" x2="${width - 100}" y2="${photoY + photoSize + 20}" 
            stroke="#ffffff" stroke-width="1" opacity="0.5"/>
      
      <!-- Title text -->
      <text x="${width / 2}" y="85" 
            font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
            fill="#ffffff" text-anchor="middle">CURSOR AI</text>
      
      <!-- Subtitle -->
      <text x="${width / 2}" y="110" 
            font-family="Arial, sans-serif" font-size="16" 
            fill="#cccccc" text-anchor="middle">PHOTO BOOTH</text>
      
      <!-- Bottom text -->
      <text x="${width / 2}" y="${height - 40}" 
            font-family="Arial, sans-serif" font-size="14" 
            fill="#cccccc" text-anchor="middle">Powered by Cursor AI</text>
      
      <!-- Corner decorations -->
      <circle cx="50" cy="50" r="3" fill="#ffffff"/>
      <circle cx="${width - 50}" cy="50" r="3" fill="#ffffff"/>
      <circle cx="50" cy="${height - 50}" r="3" fill="#ffffff"/>
      <circle cx="${width - 50}" cy="${height - 50}" r="3" fill="#ffffff"/>
    </svg>
  `

  // Generate the frame template
  await sharp(Buffer.from(svgFrame))
    .composite([
      {
        input: logo,
        top: 780,
        left: Math.floor((width - 200) / 2)
      }
    ])
    .png()
    .toFile(join(process.cwd(), 'public', 'frame-template.png'))

  console.log('Frame template generated successfully!')
}

generateFrame().catch(console.error)
