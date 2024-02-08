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
    accessorKey: "createdAt",
    header: "Created At",
  },
  // the string of details submitted to explain the request
  {
    accessorKey: "details",
    header: "Details",
  },
  // pendingApproval: boolean;
  {
    accessorKey: "pendingApproval",
    header: "Pending Approval",
  },
  //   approved: boolean;
  {
    accessorKey: "approved",
    header: "Approved",
  },
  //   pendingPayout: boolean;
  {
    accessorKey: "pendingPayout",
    header: "Pending Payout",
  },
  //   paid: boolean;
  {
    accessorKey: "paid",
    header: "Paid",
  },
  //   hasPreScreen: boolean;
  {
    accessorKey: "hasPreScreen",
    header: "Completed Pre-Screen",
  },
  //   hasPostScreen: boolean;
  {
    accessorKey: "hasPostScreen",
    header: "Completed Post-Screen",
  },
  // actions
  {
    accessorKey: "actions",
    header: "Actions",
  },
];
