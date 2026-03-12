import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
} from '@/app/utils/api'
import { isValidMediaType, isValidUrl } from '@/app/utils/validation'
import { CreateMediaBody } from '@/app/types/media'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    const media = await prisma.media.findUnique({
      where: { id }
    })

    if (!media) return notFoundError('Media')

    return successResponse(media)
  } catch (error) {
    console.error('[GET /api/media/[id]]', error)
    return errorResponse('Failed to fetch media')
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params
    const body: Partial<CreateMediaBody> = await req.json()

    const { title, description, type, url } = body

    const existing = await prisma.media.findUnique({
      where: { id }
    })

    if (!existing) return notFoundError('Media')

    if (type && !isValidMediaType(type)) {
      return validationError('Invalid media type. Must be VIDEO or AUDIO')
    }

    if (url && !isValidUrl(url)) {
      return validationError('Invalid URL')
    }

    const updated = await prisma.media.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(url && { url }),
      }
    })

    return successResponse(updated)
  } catch (error) {
    console.error('[PUT /api/media/[id]]', error)
    return errorResponse('Failed to update media')
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    const existing = await prisma.media.findUnique({
      where: { id }
    })

    if (!existing) return notFoundError('Media')

    await prisma.media.delete({
      where: { id }
    })

    return successResponse({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('[DELETE /api/media/[id]]', error)
    return errorResponse('Failed to delete media')
  }
}