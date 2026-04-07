import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function GET() {
  const email = 'yousafe.contact.inquire@gmail.com'
  const password = 'Hudhud@raed.33311960/belgacem'

  const existing = await prisma.admin.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Admin already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const admin = await prisma.admin.create({
    data: { email, password: hashedPassword },
  })

  return NextResponse.json({ success: true, id: admin.id, email: admin.email })
}
