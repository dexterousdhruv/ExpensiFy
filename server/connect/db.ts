import { PrismaClient } from "@prisma/client";


const createPrismaClient = () =>
  new PrismaClient({
    log: ['query', 'error']
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prismaDb = globalForPrisma.prisma ?? createPrismaClient();

