"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ViewRequest from "@/components/shared/view-request";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Transaction = {
  id: number;
  created_at: Date;
  AssetId: number | null;
  UserId: string;
  FundTypeId: number | null;
  quantity: number | null;
  unitValue: number | null;
  totalValue: number;
  TransactionId: number | null;
  isPurchase: boolean;
  isDisbursement: boolean;
  isReversal: boolean;
  isDeposit: boolean;
  isCARES: boolean;
  isRFF: boolean;
  details: string;
  previousBalance: number | null;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "created_at",
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
    accessorKey: "totalValue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "previousBalance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Previous Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) => getBalanceType(row),
    id: "balanceType",
    cell: ({ getValue }) => <Badge>{getValue() as string}</Badge>,
    header: () => <span>Balance Type</span>,
  },
  {
    accessorFn: (row) => getTransactionType(row),
    id: "transactionType",
    cell: ({ getValue }) => <Badge>{getValue() as string}</Badge>,
    header: () => <span>Transaction Type</span>,
  },
  {
    accessorKey: "details",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Details
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
function getTransactionType(transaction: Transaction): string {
  if (transaction.isPurchase) return "Purchase";
  if (transaction.isDisbursement) return "Disbursement";
  if (transaction.isReversal) return "Reversal";
  if (transaction.isDeposit) return "Deposit";
  return "Unknown";
}

function getBalanceType(transaction: Transaction): string {
  if (transaction.isCARES) return "CARES";
  if (transaction.isRFF) return "RFF";
  return "Unknown";
}
