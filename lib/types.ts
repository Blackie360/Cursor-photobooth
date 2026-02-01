export interface ImageTransform {
  imageSrc: string
  crop: { x: number; y: number }
  zoom: number
  croppedAreaPixels: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface ExportRequest {
  imageData: string
  crop: { x: number; y: number }
  zoom: number
  croppedAreaPixels: {
    x: number
    y: number
    width: number
    height: number
  }
}
