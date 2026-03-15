import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { CreateMediaBody } from '@/app/types/media'
import {
  successResponse,
  errorResponse,
  validationError,
} from '@/app/utils/api'
import { isValidMediaType, isValidUrl } from '@/app/utils/validation'
import { requireAuth, unauthorizedError } from '@/app/utils/api'
export async function GET(): Promise<Response> {
  try {
    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return successResponse(media)
  } catch (error) {
    console.error('[GET /api/media]', error)
    return errorResponse('Failed to fetch media')
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const session = await requireAuth()
  if (!session) return unauthorizedError()
  try {
    const body: CreateMediaBody = await req.json()

    const {
      title,
      description,
      type,
      url,
    } = body

    if (!title || !type || !url) {
      return validationError('Missing required fields')
    }

    if (!isValidMediaType(type)) {
      return validationError('Invalid media type. Must be VIDEO or AUDIO')
    }

    if (!isValidUrl(url)) {
      return validationError('Invalid URL')
    }

    const media = await prisma.media.create({
      data: {
        title,
        description: description ?? null,
        type,
        url,
      }
    })

    return successResponse(media, 201)
  } catch (error) {
    console.error('[POST /api/media]', error)
    return errorResponse('Failed to create media')
  }
}