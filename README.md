# Cursor-photobooth

A virtual photo booth application for Cursor AI that allows users to upload photos, position them within a decorative Cursor-branded frame, and download the final result.

## Features

- 📸 Upload photos via drag-and-drop or file picker
- 🎨 Interactive crop and zoom controls
- 🖼️ Live preview with branded Cursor AI frame
- ⬇️ Download high-quality PNG with photo composited into frame
- 🎯 Professional dark theme matching Cursor branding

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- react-easy-crop
- Sharp (server-side image processing)

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Click "Upload Photo" to select an image
2. Use the crop interface to position your photo
3. Adjust zoom with the slider (0.5x - 3x)
4. Preview updates in real-time
5. Click "Download Photo" to get your branded image

## Project Structure

```
app/
  page.tsx                    # Main photo booth page
  api/export/route.ts         # Image processing API
components/
  frame-preview/              # Preview with frame overlay
  position-controls/          # Zoom and position controls
lib/
  types.ts                    # TypeScript interfaces
  utils.ts                    # Helper functions
public/
  cursor-logo.png             # Cursor logo
  frame-template.png          # Frame template
```

## License

MIT
