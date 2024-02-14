"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type User = {
  id: number;
  userId: string;
  first_name: string;
  last_name: string;
  emailAddresses: {
    id: number;
    email: string;
  }[];
  clients: {
    id: number;
    first_name: string;
    last_name: string;
    contactInfo: string | null;
    caseNumber: string | null;
    dateOfBirth: Date;
    sex: string;
    race: string;
  }[];
  requests: {
    id: number;
    clientId: number;
    agencyId: number;
    pendingApproval: boolean;
    denied: boolean;
    approved: boolean;
    paid: boolean;
    pendingPayout: boolean;
    hasPreScreen: boolean;
    hasPostScreen: boolean;
    funds: {
      id: number;
      requestId: number;
      fundType: {
        id: number;
        typeName: string;
      };
      amount: number;
    }[];
  }[];
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "users",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
        </Button>
      );
    },
  },
  {
    accessorKey: "emails",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Emails
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "clients",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clients
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "actions",
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
            <DropdownMenuLabel></DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>View Request</DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* 
            add function to dropdown menu item like:
            onClick={() => navigator.clipboard.writeText(payment.id)}
             */}
            {/* <DropdownMenuItem className="bg-green-600 text-white">
              Approve
            </DropdownMenuItem>
            <div className="py-0.5" />
            <DropdownMenuItem className="bg-red-600 text-white">
              Deny
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
