import { PrismaClient } from '@prisma/client';

interface ICustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
  // You can declare anything you need.
}

declare const global: ICustomNodeJsGlobal;

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
