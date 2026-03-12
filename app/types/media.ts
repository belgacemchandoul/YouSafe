import { MediaType } from '@/app/generated/prisma/client'

export interface CreateMediaBody {
  title: string
  description?: string
  type: MediaType
  url: string
}