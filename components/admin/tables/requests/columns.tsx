// client component to contain our column definitions
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // name of submitting agency
  {
    accessorKey: "agency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Agency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Completed Pre-Screen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  //   hasPostScreen: boolean;
  {
    accessorKey: "hasPostScreen",
    header: "Completed Post-Screen",
  },
  // actions
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
