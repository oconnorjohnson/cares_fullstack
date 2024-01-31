import { publicProcedure, router } from "./trpc";
import { prisma } from "@/prisma/prismaFunctions";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { getClientsByUserId } from "@/prisma/prismaFunctions";

export const appRouter = router({
  addClient: publicProcedure.mutation(async () => {}),
  getTodos: publicProcedure.query(async () => {
    return [10, 30, 30, 40, 50, 60, 70, 80, 90, 100];
  }),
  getUser: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const user = await prisma.user.findUnique({ where: { userId } });
      return user;
    }),
  getClients: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const clients = await getClientsByUserId(userId);
      return clients;
    }),
});

export type AppRouter = typeof appRouter;
