import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { CreateLocationBody } from '@/app/types/locations'
import {
  successResponse,
  errorResponse,
  validationError,
  unauthorizedError,
  requireAuth,
} from '@/app/utils/api'
import { isValidCategory, isValidCoordinates } from '@/app/utils/validation'

export async function GET(): Promise<Response> {
  try {
    const locations = await prisma.location.findMany({
      include: {
        features: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    return successResponse(locations)
  } catch (error) {
    console.error('[GET /api/locations]', error)
    return errorResponse('Failed to fetch locations')
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await requireAuth()
    if (!session) return unauthorizedError()

    const body: CreateLocationBody = await req.json()
    const {
      name, slug, description, address, city,
      latitude, longitude, category, isApproved,
      isFeatured, verified, accessibilityRating,
      accessibilityNotes, features, images,
    } = body

    if (!name || !slug || !description || !address || !city || !latitude || !longitude || !category) {
      return validationError('Missing required fields')
    }

    if (!isValidCategory(category)) {
      return validationError('Invalid category')
    }

    if (!isValidCoordinates(latitude, longitude)) {
      return validationError('Invalid coordinates')
    }

    const location = await prisma.location.create({
      data: {
        name, slug, description, address, city,
        latitude, longitude, category,
        isApproved: isApproved ?? true,
        isFeatured: isFeatured ?? false,
        verified: verified ?? false,
        accessibilityRating: accessibilityRating ?? null,
        accessibilityNotes: accessibilityNotes ?? null,
        features: {
          create: features?.map((name: string) => ({ name })) ?? []
        },
        images: {
          create: images?.map((url: string) => ({ url })) ?? []
        }
      },
      include: { features: true, images: true }
    })

    revalidatePath('/')
    revalidatePath('/locations', 'layout')
    revalidatePath('/map')
    return successResponse(location, 201)
  } catch (error) {
    console.error('[POST /api/locations]', error)
    return errorResponse('Failed to create location')
  }
}