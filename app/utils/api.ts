import { NextResponse } from 'next/server'

export const successResponse = (data: unknown, status = 200) => {
  return NextResponse.json(data, { status })
}

export const errorResponse = (message: string, status = 500) => {
  return NextResponse.json({ error: message }, { status })
}

export const validationError = (message: string) => {
  return errorResponse(message, 400)
}

export const notFoundError = (resource: string) => {
  return errorResponse(`${resource} not found`, 404)
}

export const unauthorizedError = () => {
  return errorResponse('Unauthorized', 401)
}