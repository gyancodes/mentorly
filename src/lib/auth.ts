import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { db } from './db'

/**
 * Better Auth configuration for user authentication and session management
 * 
 * Features:
 * - Email/password authentication
 * - PostgreSQL database integration via Prisma
 * - 7-day session expiration with 1-day update interval
 * - Custom ID generation compatible with Prisma's cuid format
 * 
 * @example
 * ```typescript
 * // Usage in API routes
 * const session = await auth.api.getSession({ headers: request.headers });
 * if (session) {
 *   // User is authenticated
 *   console.log(session.user.email);
 * }
 * ```
 */
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    generateId: () => {
      // Use custom ID generation to match Prisma's cuid format
      return crypto.randomUUID().replace(/-/g, '')
    },
  },
})

export type Session = typeof auth.$Infer.Session
export type User = Session['user']
