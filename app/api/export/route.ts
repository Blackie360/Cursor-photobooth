import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { join } from 'path'
import { readFileSync } from 'fs'
import type { ExportRequest } from '@/lib/types'
import { base64ToBuffer } from '@/lib/utils'

// Frame template configuration
// Template dimensions: 800 x 1000 pixels
// Photo area: 600 x 600 pixels, centered horizontally, starting at y=150
const PHOTO_X = 100     // Centered horizontally: (800 - 600) / 2 = 100
const PHOTO_Y = 150     // Top position - aligned with photo placeholder area
const PHOTO_SIZE = 600  // Square photo size - matches frame design

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json()

    // Validate required fields
    if (
      !body.imageData ||
      !body.crop ||
      !body.zoom ||
      !body.croppedAreaPixels
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Load frame template image
    const templatePath = join(process.cwd(), 'public', 'frame-template.png')
    const templateBuffer = readFileSync(templatePath)

    // Load user's image
    const imageBuffer = base64ToBuffer(body.imageData)

    // Get template image metadata
    const templateMetadata = await sharp(templateBuffer).metadata()
    const templateWidth = templateMetadata.width || 400
    const templateHeight = templateMetadata.height || 600

    // Process user's image - crop and resize
    const { croppedAreaPixels, zoom } = body
    const sourceX = croppedAreaPixels.x
    const sourceY = croppedAreaPixels.y
    const sourceWidth = croppedAreaPixels.width
    const sourceHeight = croppedAreaPixels.height

    // Normalize the image by applying EXIF orientation
    // react-easy-crop displays images with EXIF orientation applied,
    // so we need to normalize here too to match what the user sees
    // Always use rotate() which auto-rotates based on EXIF data
    const normalizedBuffer = await sharp(imageBuffer)
      .rotate() // Auto-rotate based on EXIF orientation
      .toBuffer()
    
    const normalizedMetadata = await sharp(normalizedBuffer).metadata()
    const normalizedWidth = normalizedMetadata.width || sourceWidth
    const normalizedHeight = normalizedMetadata.height || sourceHeight

    // Extract the cropped area
    // croppedAreaPixels coordinates are relative to the displayed image (with EXIF applied)
    // Since we normalized above, coordinates should match
    const croppedUserImage = await sharp(normalizedBuffer)
      .extract({
        left: Math.max(0, Math.floor(sourceX)),
        top: Math.max(0, Math.floor(sourceY)),
        width: Math.min(Math.floor(sourceWidth), normalizedWidth - Math.floor(sourceX)),
        height: Math.min(Math.floor(sourceHeight), normalizedHeight - Math.floor(sourceY)),
      })
      .resize(PHOTO_SIZE, PHOTO_SIZE, {
        fit: 'cover',
        position: 'center',
      })
      .toBuffer()

    // Composite the user's image onto the template
    const result = await sharp(templateBuffer)
      .composite([
        {
          input: croppedUserImage,
          left: PHOTO_X,
          top: PHOTO_Y,
        },
      ])
      .png()
      .toBuffer()

    // Return PNG
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="cursor-photo-booth.png"',
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate card' },
      { status: 500 }
    )
  }
}
