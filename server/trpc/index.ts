import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import {
  deleteClientById as deleteClientFromDB,
  deleteFundTypeById as deleteFundTypeFromDB,
  deleteAgencyById as deleteAgencyFromDB,
} from "@/server/supabase/functions/delete";
import { banUserById } from "@/server/supabase/functions/update";
import {
  getClientsByUserId,
  getRequestsByUserId,
  getAdminRequests,
  getRequestById,
  getFundTypes,
  getAllAgencies,
  getFundsThatNeedReceiptsByRequestId,
  getUserByUserId,
  getUserIdByRequestId,
  getEmailByUserId,
  getRequestsThatNeedAgreementsByUserId,
} from "@/server/supabase/functions/read";
import {
  getOperatingBalance,
  getRFFBalance,
} from "@/server/supabase/functions/read";
import { z } from "zod";

export const appRouter = router({
  getOperatingBalance: publicProcedure.query(async () => {
    const operatingBalance = await getOperatingBalance();
    return operatingBalance;
  }),
  getRFFBalance: publicProcedure.query(async () => {
    const rffBalance = await getRFFBalance();
    return rffBalance;
  }),
  banUser: publicProcedure
    .input(z.string())
    .mutation(async ({ input: userId }) => {
      const bannedUser = await banUserById(userId);
      return bannedUser;
    }),
  getUser: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const user = await getUserByUserId(userId);
      return user;
    }),
  getFundTypes: publicProcedure.query(async () => {
    const fundTypes = await getFundTypes();
    return fundTypes;
  }),
  getAgencies: publicProcedure.query(async () => {
    const getAgencies = await getAllAgencies();
    return getAgencies;
  }),
  getFundsThatNeedReceipts: publicProcedure
    .input(z.number())
    .query(async ({ input: requestId }) => {
      const funds = await getFundsThatNeedReceiptsByRequestId(requestId);
      return funds;
    }),
  getRequestsThatNeedAgreements: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const requests = await getRequestsThatNeedAgreementsByUserId(userId);
      return requests;
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
  getUserDetailsByRequestId: publicProcedure
    .input(z.number())
    .query(async ({ input: requestId }) => {
      try {
        // First, get the userId associated with the requestId
        const userIdResult = await getUserIdByRequestId(requestId);
        if (!userIdResult.data || userIdResult.data.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User ID not found for request ID: ${requestId}`,
          });
        }
        const userId = userIdResult.data[0].userId;

        // Then, use the userId to get the user's details
        const userDetails = await getUserByUserId(userId);
        if (!userDetails) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `User details not found for user ID: ${userId}`,
          });
        }

        return userDetails;
      } catch (error) {
        console.error(
          `Error fetching user details by request ID ${requestId}: `,
          error,
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch user details for request ID: ${requestId}`,
        });
      }
    }),
  getEmailByUserId: publicProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const user = await getEmailByUserId(userId);
      return user;
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
      return await getAdminRequests();
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
