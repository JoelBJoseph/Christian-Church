import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return new PrismaClient();
  }
  
  // Dynamic imports to avoid loading Node.js modules in Edge runtime
  // @ts-expect-error - require is allowed here for dynamic loading
  const { PrismaPg } = require('@prisma/adapter-pg')
  // @ts-expect-error - require is allowed here for dynamic loading
  const pg = require('pg')
  
  const connectionString = process.env.DATABASE_URL
  const pool = new pg.Pool({ 
    connectionString,
    ssl: true
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
