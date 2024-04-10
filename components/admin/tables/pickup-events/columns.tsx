"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react";

export type PickupEvent = {
  id: number;
  created_at: string;
  pickup_date: string;
  RequestId: number;
  UserId: string;
};

export const columns: ColumnDef<PickupEvent>[] = [
  {
    accessorKey: "pickup_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pickup Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "RequestId",
    cell: ({ row }) => {
      const request = row.original;

      return (
        <Link href={`/admin/requests/${request.RequestId}`}>
          <Eye className="h-4 w-4" />
        </Link>
      );
    },
  },
];
