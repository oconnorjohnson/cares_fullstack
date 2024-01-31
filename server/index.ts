import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import {
  prisma,
  getClientsByUserId,
  deleteClient as deleteClientFromDB,
} from "@/prisma/prismaFunctions";
import { z } from "zod";

export const appRouter = router({
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
  deleteClient: publicProcedure
    .input(z.number()) // Assuming the client ID is a string
    .mutation(async ({ input: clientId }) => {
      // Call the deleteClient function with the provided client ID
      try {
        const deletedClient = await deleteClientFromDB(clientId);
        return deletedClient;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete client",
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
