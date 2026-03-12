import { Category, MediaType } from '@/app/generated/prisma/client'

export const isValidCategory = (category: string): category is Category => {
  return Object.values(Category).includes(category as Category)
}

export const isValidMediaType = (type: string): type is MediaType => {
  return Object.values(MediaType).includes(type as MediaType)
}

export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}