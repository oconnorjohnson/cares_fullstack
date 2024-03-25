"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FundType {
  created_at: string;
  id: number;
  needsReceipt: boolean;
  typeName: string;
  userId: string | null;
}

export type Fund = {
  amount: number;
  created_at: string;
  fundTypeId: number;
  id: number;
  needsReceipt: boolean | null;
  receiptId: number | null;
  requestId: number;
  isCARES: boolean | null;
  isRFF: boolean | null;
  FundType: FundType;
  AssetIds: number[] | null;
};

export const columns: ColumnDef<Fund>[] = [
  {
    accessorKey: "requestId",
    cell: ({ row }) => {
      const fund = row.original;
      return (
        <Link
          href="/admin/requests/[requestId]"
          as={`/admin/requests/${fund.requestId}`}
        >
          <Button size="icon" variant="outline">
            {fund.requestId}{" "}
          </Button>
        </Link>
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
