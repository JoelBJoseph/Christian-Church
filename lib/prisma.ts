import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  const isLocal = !connectionString || /localhost|127\.0\.0\.1/.test(connectionString)
  const pool = new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  })

  return new PrismaClient({ adapter: new PrismaPg(pool) })
}

declare global {
  var prisma: undefined | ReturnType<typeof createPrismaClient>
}

const prisma = globalThis.prisma ?? createPrismaClient()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
