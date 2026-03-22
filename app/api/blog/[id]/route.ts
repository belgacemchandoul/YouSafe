import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
  requireAuth,
  unauthorizedError,
} from '@/app/utils/api'
import { generateSlug } from '@/app/utils/slug'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return notFoundError('Blog post')
    return successResponse(post)
  } catch (error) {
    console.error('[GET /api/blog/[id]]', error)
    return errorResponse('Failed to fetch blog post')
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
    const body = await req.json()
    const { title, slug, excerpt, content, coverImage, published } = body

    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return notFoundError('Blog post')

    const finalSlug = slug || (title ? generateSlug(title) : existing.slug)

    if (finalSlug !== existing.slug) {
      const slugTaken = await prisma.blogPost.findUnique({ where: { slug: finalSlug } })
      if (slugTaken) return validationError('A post with this slug already exists')
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
        slug: finalSlug,
      }
    })

    return successResponse(updated)
  } catch (error) {
    console.error('[PUT /api/blog/[id]]', error)
    return errorResponse('Failed to update blog post')
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
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) return notFoundError('Blog post')

    await prisma.blogPost.delete({ where: { id } })
    return successResponse({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('[DELETE /api/blog/[id]]', error)
    return errorResponse('Failed to delete blog post')
  }
}