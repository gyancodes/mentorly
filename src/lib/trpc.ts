import { initTRPC } from '@trpc/server'
import { db } from './db'
import { z } from 'zod'

// Create context for tRPC (fetch adapter)
export const createTRPCContext = (opts: { req?: Request; resHeaders?: Headers }) => {
  return {
    db,
    ...opts,
  }
}

export type Context = ReturnType<typeof createTRPCContext>

// Initialize tRPC
const t = initTRPC.context<Context>().create()

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure