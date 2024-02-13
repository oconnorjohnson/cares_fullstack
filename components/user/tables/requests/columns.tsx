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

export type Request = {
  id: number;
  userId: {
    userId: string;
  };
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
  denied: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  createdAt: Date;
  isHighlighted?: boolean;
};

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "agency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Agency <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "client",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "combinedStatus",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      let badgeColor: "yellow" | "green" | "red" | undefined;

      switch (status) {
        case "Pending":
          badgeColor = "yellow";
          break;
        case "Approved":
          badgeColor = "green";
          break;
        case "Denied":
          badgeColor = "red";
          break;
        default:
          badgeColor = undefined;
      }

      return <Badge color={badgeColor}>{status}</Badge>;
    },
  },
  {
    accessorKey: "hasPreScreen",
    header: "Actions",
    cell: ({ row }) => {
      const { hasPreScreen, hasPostScreen, paid, denied } = row.original;
      let content;
      let badgeColor: "green" | "yellow" | "red" | undefined;

      if (!hasPreScreen) {
        content = "Complete PreScreen";
        badgeColor = "yellow";
      } else if (hasPreScreen && !paid && !denied) {
        content = "Awaiting Payment";
        badgeColor = undefined;
      } else if (hasPreScreen && paid && !hasPostScreen) {
        content = paid
          ? "Complete PostScreen"
          : "No actions required at this time";
        badgeColor = "yellow";
      } else if (hasPreScreen && hasPostScreen && paid) {
        content = "Closed";
        badgeColor = "green";
      } else if (denied) {
        content = "Closed";
        badgeColor = "red";
      } else {
        content = "Contact Support";
        badgeColor = "red";
      }

      return <Badge color={badgeColor}>{content}</Badge>;
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
