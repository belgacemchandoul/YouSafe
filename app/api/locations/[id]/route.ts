import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { UpdateLocationBody } from '@/app/types/locations'
import {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
  unauthorizedError,
  requireAuth,
} from '@/app/utils/api'
import { isValidCategory, isValidCoordinates } from '@/app/utils/validation'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params
    const location = await prisma.location.findUnique({
      where: { id },
      include: { features: true, images: true }
    })
    if (!location) return notFoundError('Location')
    return successResponse(location)
  } catch (error) {
    console.error('[GET /api/locations/[id]]', error)
    return errorResponse('Failed to fetch location')
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireAuth()
    if (!session) return unauthorizedError()

    const { id } = await params
    const body: UpdateLocationBody = await req.json()
    const {
      name, slug, description, address, city,
      latitude, longitude, category, isApproved,
      isFeatured, verified, accessibilityRating,
      accessibilityNotes, features, images,
    } = body

    const existing = await prisma.location.findUnique({ where: { id } })
    if (!existing) return notFoundError('Location')

    if (category && !isValidCategory(category)) {
      return validationError('Invalid category')
    }

    if (latitude && longitude && !isValidCoordinates(latitude, longitude)) {
      return validationError('Invalid coordinates')
    }

    if (features) {
      await prisma.feature.deleteMany({ where: { locationId: id } })
    }

    if (images) {
      await prisma.image.deleteMany({ where: { locationId: id } })
    }

    const updated = await prisma.location.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(address && { address }),
        ...(city && { city }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude }),
        ...(category && { category }),
        ...(isApproved !== undefined && { isApproved }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(verified !== undefined && { verified }),
        ...(accessibilityRating !== undefined && { accessibilityRating }),
        ...(accessibilityNotes !== undefined && { accessibilityNotes }),
        ...(features && {
          features: { create: features.map((name: string) => ({ name })) }
        }),
        ...(images && {
          images: { create: images.map((url: string) => ({ url })) }
        }),
      },
      include: { features: true, images: true }
    })

    revalidatePath('/')
    revalidatePath('/locations', 'layout')
    revalidatePath('/map')
    return successResponse(updated)
  } catch (error) {
    console.error('[PUT /api/locations/[id]]', error)
    return errorResponse('Failed to update location')
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireAuth()
    if (!session) return unauthorizedError()

    const { id } = await params
    const existing = await prisma.location.findUnique({ where: { id } })
    if (!existing) return notFoundError('Location')

    await prisma.location.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/locations', 'layout')
    revalidatePath('/map')
    return successResponse({ message: 'Location deleted successfully' })
  } catch (error) {
    console.error('[DELETE /api/locations/[id]]', error)
    return errorResponse('Failed to delete location')
  }
}