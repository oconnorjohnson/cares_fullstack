import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.create({ transformer: superjson });

export const appRouter = t.router({
  getUsers: t.procedure.query(({ ctx }) => {
    const users = fetchUsersFromDatabase(); // Placeholder function
    return users;
  }),
});

export type AppRouter = typeof appRouter;

// this would be moved to prismaFunctions
async function fetchUsersFromDatabase() {
  // Logic to fetch users from your database or another data source
  return [
    // Example user data
    { id: "1", name: "John Doe", email: "johndoe@example.com" },
    { id: "2", name: "Jane Doe", email: "janedoe@example.com" },
  ];
}
