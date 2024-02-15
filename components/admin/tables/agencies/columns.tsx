"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Agency = {
  id: number;
  name: string;
  userId: string;
};

export const columns: ColumnDef<Agency>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Agency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const agency = row.original;

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
            <Link href="/">
              <DropdownMenuItem>View agency</DropdownMenuItem>
            </Link>
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
