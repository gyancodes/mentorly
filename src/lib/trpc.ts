import { initTRPC } from '@trpc/server'
import { db } from './db'
import { z } from 'zod'
import { auth } from './auth'
import { headers } from 'next/headers'

// Create context for tRPC (fetch adapter)
export const createTRPCContext = async (opts: { req?: Request; resHeaders?: Headers }) => {
  // Get session from request headers
  let session = null
  try {
    if (opts.req) {
      // Extract session from request
      session = await auth.api.getSession({
        headers: opts.req.headers
      })
    }
  } catch (error) {
    // Session extraction failed, user is not authenticated
    session = null
  }

  return {
    db,
    session,
    ...opts,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

// Initialize tRPC
const t = initTRPC.context<Context>().create()

// Create a protected procedure that requires authentication
const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new Error('Unauthorized')
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export { protectedProcedure }