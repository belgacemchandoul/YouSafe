import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Category } from '@/app/generated/prisma/client'

interface LocationData {
  name: string
  slug: string
  description: string
  address: string
  city: string
  latitude: number
  longitude: number
  category: string
  accessibilityFeatures?: string[]
  accessibilityNotes?: string
  accessibilityRating?: number
  isApproved?: boolean
  isFeatured?: boolean
  verified?: boolean
}

const categoryMap: Record<string, Category> = {
  RESTAURANT: Category.RESTAURANT,
  CAFE: Category.CAFE,
  HOTEL: Category.HOTEL,
  SHOPPING: Category.SHOPPING,
  TRANSPORT: Category.TRANSPORT,
  HOSPITAL: Category.HOSPITAL,
  PHARMACY: Category.PHARMACY,
  PARK: Category.PARK,
  EDUCATION: Category.EDUCATION,
  ENTERTAINMENT: Category.ENTERTAINMENT,
  SPORT: Category.SPORT,
  GOVERNMENT: Category.GOVERNMENT,
  RELIGIOUS: Category.RELIGIOUS,
  TOURISM: Category.TOURISM,
  SUPERMARKET: Category.SUPERMARKET,
  BANK: Category.BANK,
  POST_OFFICE: Category.POST_OFFICE,
  MUSEUM: Category.MUSEUM,
  LIBRARY: Category.LIBRARY,
  BEACH: Category.BEACH,
  PUBLIC_TOILET: Category.PUBLIC_TOILET,
  OTHER: Category.OTHER,
}

export async function GET() {
  try {
    await prisma.feature.deleteMany()
    await prisma.image.deleteMany()
    await prisma.location.deleteMany()

    const res = await fetch('http://localhost:3000/dublin_accessibility.json')
    const locations: LocationData[] = await res.json()

    let count = 0
    for (const location of locations) {
      await prisma.location.create({
        data: {
          name: location.name,
          slug: location.slug,
          description: location.description,
          address: location.address,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          category: categoryMap[location.category] ?? Category.OTHER,
          isApproved: location.isApproved ?? true,
          isFeatured: location.isFeatured ?? false,
          verified: location.verified ?? false,
          accessibilityRating: location.accessibilityRating ?? null,
          accessibilityNotes: location.accessibilityNotes ?? null,
          features: {
            create: (location.accessibilityFeatures ?? []).map((name: string) => ({ name }))
          }
        }
      })
      count++
    }

    return NextResponse.json({ message: `✅ ${count} locations seeded successfully` })
  } catch (error) {
    console.error('[SEED]', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
