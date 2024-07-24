// client component to contain our column definitions
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
  userId: string;
  client: {
    id: number;
    clientID: string;
  };
  User: {
    id: number;
    userId: string;
    first_name: string;
    last_name: string;
    isBanned: boolean;
  };
  Agency: {
    id: number;
    name: string;
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
  adminOne: string | null;
  adminTwo: string | null;
  adminThree: string | null;
  funds: { id: number; typeName: string; amount: number }[];
};
export const columns: ColumnDef<Request>[] = [
  // checkboxes
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // name of logged in user
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // name of submitting agency
  // {
  //   accessorKey: "agency",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Agency
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  // name of client request is submitted on behalf of
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
  // the date the request was submitted
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Created
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  // status: complex conditional render;
  {
    accessorKey: "funds",
    header: "Funds",
    cell: ({ row }) => {
      const funds = row.original.funds;
      return (
        <div className="max-w-[200px] overflow-auto">
          {funds.map((fund) => (
            <div key={fund.id} className="text-sm">
              ID: {fund.id}, {fund.typeName}: ${fund.amount}
            </div>
          ))}
        </div>
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

      return <Badge color={badgeColor}>{status.toUpperCase()}</Badge>;
    },
  },
  //   paid: boolean;
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
    cell: ({ getValue }) => {
      const status = getValue() as string;
      let badgeColor: "yellow" | "green" | "red" | undefined;

      switch (status) {
        case "True":
          badgeColor = "green";
          break;
        case "False":
          badgeColor = "red";
          break;
      }

      return <Badge color={badgeColor}>{status.toUpperCase()}</Badge>;
    },
  },
  //   hasPreScreen: boolean;
  // {
  //   accessorKey: "hasPreScreen",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Pre-Screen
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  //   hasPostScreen: boolean;
  // {
  //   accessorKey: "hasPostScreen",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Post-Screen
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  // actions
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
            <Link href={`/admin/requests/${request.id}`}>
              <DropdownMenuItem>View Request</DropdownMenuItem>
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
