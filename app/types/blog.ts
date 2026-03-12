export interface CreateBlogBody {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  published?: boolean
}

export interface UpdateBlogBody extends Partial<CreateBlogBody> {
  id: string
}