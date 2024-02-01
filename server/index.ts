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
      console.log(`Attempting to delete client with ID: ${clientId}`); // Log the client ID being deleted
      // Call the deleteClient function with the provided client ID
      try {
        const deletedClient = await deleteClientFromDB(clientId);
        console.log(`Successfully deleted client: `, deletedClient); // Log the result of the deletion
        return deletedClient;
      } catch (error) {
        console.error(`Error deleting client with ID ${clientId}: `, error); // Log any errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete client",
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
