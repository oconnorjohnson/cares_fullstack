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
import SchedulePickup from "@/components/forms/pickup-scheduler";
import ReceiptDialog from "@/components/user/receipt-dialog";
import AgreementDialog from "@/components/user/agreement-dialog";
import PickupRescheduler from "@/components/forms/pickup-rescheduler";

export type Request = {
  id: number;
  userId: {
    userId: string;
  };
  client: {
    id: number;
    clientId: string | null;
    race: string;
    sex: string;
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
  agreementUrl: string | null;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  needsReceipts: boolean;
  hasReceipts: boolean;
  createdAt: Date;
  isHighlighted?: boolean;
  isPickupScheduled: boolean;
  pickup_date: string | null;
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
        user,
        hasPreScreen,
        hasPostScreen,
        approved,
        pendingApproval,
        paid,
        denied,
        needsReceipts,
        hasReceipts,
        agreementUrl,
        id: requestId,
        isPickupScheduled,
        pickup_date,
      } = row.original;
      let content;

      if (denied) {
        return <Badge color="red">Denied</Badge>;
      } else if (!hasPreScreen) {
        return <PreScreen requestId={requestId} />;
      } else if (hasPreScreen && !approved) {
        return <Badge color="yellow">Pending Approval</Badge>;
      } else if (hasPreScreen && approved && !paid && !isPickupScheduled) {
        return <SchedulePickup requestId={requestId} userId={user?.userId} />;
      } else if (hasPreScreen && approved && !paid && isPickupScheduled) {
        return (
          <PickupRescheduler requestId={requestId} userId={user?.userId} />
        );
      } else if (
        hasPreScreen &&
        approved &&
        paid &&
        isPickupScheduled &&
        !agreementUrl
      ) {
        return <AgreementDialog requestId={requestId} />;
      } else if (
        hasPreScreen &&
        approved &&
        paid &&
        agreementUrl &&
        !hasPostScreen &&
        !needsReceipts
      ) {
        return <PostScreen requestId={requestId} />;
      } else if (
        hasPreScreen &&
        paid &&
        agreementUrl &&
        needsReceipts &&
        !hasReceipts
      ) {
        return <ReceiptDialog requestId={requestId} />;
      } else if (
        hasPreScreen &&
        paid &&
        agreementUrl &&
        needsReceipts &&
        hasReceipts &&
        !hasPostScreen
      ) {
        return <PostScreen requestId={requestId} />;
      } else if (
        approved &&
        hasPreScreen &&
        paid &&
        agreementUrl &&
        hasPostScreen
      ) {
        return <Badge color="green">Request Completed and Closed</Badge>;
      } else {
        return (
          <Badge color="red">Email info@yolopublicdefendercares.org</Badge>
        );
      }
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
