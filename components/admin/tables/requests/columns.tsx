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
  // checkboxes
  {
    accessorKey: "checkbox",
    header: "Checkbox",
  },
  // name of logged in user
  {
    accessorKey: "user",
    header: "User",
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
  // actions
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
