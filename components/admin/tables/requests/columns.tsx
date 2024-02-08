// client component to contain our column definitions
"use client";
import { ColumnDef } from "@tanstack/react-table";

export type Request = {
  userId: string;
  client: {
    id: number;
    first_name: string;
    last_name: string;
  };
  user: {
    id: number;
    userId: string;
    first_name: string;
    last_name: string;
    isBanned: boolean;
  };
  agency: {
    id: number;
    name: string;
    userId: string;
  };
  details: string;
  pendingApproval: boolean;
  approved: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  createdAt: Date;
};
export const columns: ColumnDef<Request>[] = [
  // name of logged in user
  {
    accessorKey: "user",
    header: "User",
  },
  // array of fund objects { might need to rethink how funds are rendered in this table. Maybe just as a link to a different table with related fund objects and their fundType objects }
  {
    accessorKey: "funds",
    header: "Funds",
  },
  // name of submitting agency
  {
    accessorKey: "agency",
    header: "Agency",
  },
  // name of client request is submitted on behalf of
  {
    accessorKey: "client",
    header: "Client",
  },
  // the date the request was submitted
  {
    accessorKey: "createdat",
    header: "CreatedAt",
  },
  // the string of details submitted to explain the request
  {
    accessorKey: "details",
    header: "Details",
  },
  // the string of implementation details submitted to explain the request
];
