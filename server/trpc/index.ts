import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import {
  prisma,
  getClientsByUserId,
  getRequestsByUserId,
  getAdminRequests,
  getRequestById,
  deleteClient as deleteClientFromDB,
  deleteFundType as deleteFundTypeFromDB,
  deleteAgency as deleteAgencyFromDB,
  banUserById as banUserFromDB,
} from "@/prisma/prismaFunctions";
import { z } from "zod";

export const appRouter = router({
  banUser: publicProcedure
    .input(z.string())
    .mutation(async ({ input: userId }) => {
      const bannedUser = await banUserFromDB(userId);
      return bannedUser;
    }),
  getUser: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const user = await prisma.user.findUnique({ where: { userId } });
      return user;
    }),
  getFundTypes: publicProcedure.query(async () => {
    const fundTypes = await prisma.fundType.findMany();
    return fundTypes;
  }),
  getAgencies: publicProcedure.query(async () => {
    const getAgencies = await prisma.agency.findMany();
    return getAgencies;
  }),
  getClients: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const clients = await getClientsByUserId(userId);
      return clients;
    }),
  getRequests: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const requests = await getRequestsByUserId(userId);
      return requests;
    }),
  getRequest: publicProcedure
    .input(z.number())
    .query(async ({ input: requestId }) => {
      const request = await getRequestById(requestId);
      return request;
    }),
  getAdminRequests: publicProcedure
    .input(
      z.object({
        filter: z.string(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { filter, userId } = input;
      return await getAdminRequests(filter, userId);
    }),
  deleteAgency: publicProcedure
    .input(z.number())
    .mutation(async ({ input: agencyId }) => {
      console.log(`Attempting to delete agency with ID: ${agencyId}`);
      try {
        const deletedAgency = await deleteAgencyFromDB(agencyId);
        console.log(`Successfully deleted agency: `, deletedAgency);
        return deletedAgency;
      } catch (error) {
        console.error(`Error deleteing agency ID ${agencyId}`);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete agency",
        });
      }
    }),
  deleteFundType: publicProcedure
    .input(z.number())
    .mutation(async ({ input: fundTypeId }) => {
      console.log(`Attempting to delete fundType with ID: ${fundTypeId}`);
      try {
        const deletedFundType = await deleteFundTypeFromDB(fundTypeId);
        console.log(`Successfully deleted fundType: `, deletedFundType);
        return deletedFundType;
      } catch (error) {
        console.error(`Error deleting fundType with ID ${fundTypeId}`);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete fundType",
        });
      }
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
