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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
} from "@/components/ui/dialog";
import BanUserButton from "@/components/admin/tables/requests/ban-user-button";
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
    first_name: string;
    last_name: string;
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
    accessorKey: "isBanned",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Is banned?
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
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
            <DropdownMenuSeparator />
            <BanUserButton userId={request.userId} />
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
