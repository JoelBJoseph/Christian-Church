import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return new PrismaClient();
  }

// eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require('@prisma/adapter-pg')

// eslint-disable-next-line @typescript-eslint/no-require-imports
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
