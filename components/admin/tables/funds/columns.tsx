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

export type Fund = {
  amount: number;
  fundType: { typeName: string };
  request: { id: number };
};

export const columns: ColumnDef<Fund>[] = [
  {
    accessorKey: "requestId",
    cell: ({ row }) => {
      const fund = row.original;
      return (
        <Button size="icon">
          <Link
            href="/admin/requests/[requestId]"
            as={`/admin/requests/${fund.request.id}`}
          >
            {fund.request.id}
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "typeName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
        </Button>
      );
    },
  },
];
