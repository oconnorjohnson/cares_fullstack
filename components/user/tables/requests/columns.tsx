"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import PreScreen from "@/components/forms/pre-screen";
import PostScreen from "@/components/forms/post-screen";
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
  //   {
  //     accessorKey: "createdAt",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Created
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //   },
  {
    accessorKey: "combinedStatus",
    header: "Status",
    cell: ({ row }) => {
      const { pendingApproval, approved, denied } = row.original;
      let content;
      let badgeColor: "yellow" | "green" | "red" | undefined;

      if (denied) {
        content = "Denied";
        badgeColor = "red";
      } else if (pendingApproval) {
        content = "Pending";
        badgeColor = "yellow";
      } else if (approved) {
        content = "Approved";
        badgeColor = "green";
      }

      return <Badge color={badgeColor}>{content}</Badge>;
    },
  },
  {
    accessorKey: "hasPreScreen",
    header: "Actions",
    cell: ({ row }) => {
      const {
        hasPreScreen,
        hasPostScreen,
        paid,
        denied,
        id: requestId,
      } = row.original;
      let content;

      if (denied) {
        content = <Badge color="red">Closed</Badge>;
      } else if (hasPreScreen && hasPostScreen && paid) {
        content = <Badge color="green">Request Completed and Closed</Badge>;
      } else if (hasPreScreen && !paid) {
        content = <Badge color="yellow">Awaiting Payment</Badge>;
      } else if (hasPreScreen && !hasPostScreen && paid) {
        return <PostScreen requestId={requestId} />;
      } else if (!hasPreScreen) {
        return <PreScreen requestId={requestId} />;
      } else {
        content = <Badge color="red">Check request details</Badge>;
      }

      return content;
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
