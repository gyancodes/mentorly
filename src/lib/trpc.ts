import { initTRPC } from '@trpc/server'

import { auth } from './auth'
import { db } from './db'

/**
 * Creates tRPC context for request handling with authentication session
 * 
 * @param opts - Options containing request and response headers
 * @param opts.req - Optional HTTP request object
 * @param opts.resHeaders - Optional HTTP response headers
 * @returns Promise resolving to context object with database, session, and request info
 * 
 * @example
 * ```typescript
 * const context = await createTRPCContext({ req: request });
 * // Returns: { db, session: userSession | null, req, resHeaders }
 * ```
 */
export const createTRPCContext = async (opts: {
  req?: Request
  resHeaders?: Headers
}) => {
  // Get session from request headers
  let session = null
  try {
    if (opts.req) {
      // Extract session from request
      session = await auth.api.getSession({
        headers: opts.req.headers,
      })
    }
  } catch {
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

/**
 * Protected tRPC procedure that requires user authentication
 * Throws error if no valid session is found in context
 * 
 * @throws {Error} When user is not authenticated
 * 
 * @example
 * ```typescript
 * const myProtectedRoute = protectedProcedure
 *   .input(z.object({ data: z.string() }))
 *   .mutation(({ ctx, input }) => {
 *     // ctx.session is guaranteed to exist here
 *     return ctx.db.someModel.create({ data: input.data, userId: ctx.session.user.id });
 *   });
 * ```
 */
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
