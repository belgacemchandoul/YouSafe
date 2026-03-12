import { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
  }
}

// Extend the built-in JWT types
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
  }
}