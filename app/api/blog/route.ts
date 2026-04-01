import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  validationError,
  requireAuth,
  unauthorizedError,
} from '@/app/utils/api'
import { generateSlug } from '@/app/utils/slug'

export async function GET(): Promise<Response> {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return successResponse(posts)
  } catch (error) {
    console.error('[GET /api/blog]', error)
    return errorResponse('Failed to fetch blog posts')
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await requireAuth()
    if (!session) return unauthorizedError()

    const body = await req.json()
    const { title, slug, excerpt, content, coverImage, published } = body

    if (!title || !excerpt || !content) {
      return validationError('Missing required fields')
    }

    const finalSlug = slug || generateSlug(title)

    const existing = await prisma.blogPost.findUnique({
      where: { slug: finalSlug }
    })

    if (existing) return validationError('A post with this slug already exists')

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage: coverImage ?? null,
        published: published ?? false,
      }
    })

    revalidatePath('/')
    revalidatePath('/blog', 'layout')
    return successResponse(post, 201)
  } catch (error) {
    console.error('[POST /api/blog]', error)
    return errorResponse('Failed to create blog post')
  }
}