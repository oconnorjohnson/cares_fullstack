// client component to contain our column definitions
"use client";
import { ColumnDef } from "@tanstack/react-table";

// this type is used to define the shape of our request table data
export type Request = {
  userId: string;
  id: number;
  funds: {
    id: number;
    fundType: {
      userId: string;
      id: number;
      typeName: string;
    };
    requestId: number;
    fundTypeId: number;
    amount: number;
  }[];
  agency: {
    userId: string;
    id: number;
    name: string;
  };
  client: { first_name: string; last_name: string; id: number };
  pendingApproval: boolean;
  approved: boolean;
  pendingPayout: boolean;
  paid: boolean;
  hasPreScreen: boolean;
  hasPostScreen: boolean;
  createdAt: Date;
  details: string;
  implementation: string;
  sustainability: string;
  SDOHs: { id: number; value: string };
  RFFs: { id: number; value: string };
};

export const columns: ColumnDef<Request>[] = [
  // name of logged in user
  {
    accessorKey: "user",
    header: "User",
  },
  // array of fund objects { might need to rethink how funds are rendered in this table. Maybe just as a link to a different table with related fund objects and their fundType objects }
  {
    accessorKey: "funds",
    header: "Funds",
  },
  // name of submitting agency
  {
    accessorKey: "agency",
    header: "Agency",
  },
  // name of client request is submitted on behalf of
  {
    accessorKey: "client",
    header: "Client",
  },
  // status of the request { determined by the truthiness of pendingApproval, approved, pendingPayment, and paid booleans }
  {
    accessorKey: "status",
    header: "Status",
  },
  // Have the user and client have completed the pre screen?
  {
    accessorKey: "prescreen",
    header: "PreScreen",
  },
  // have the user and client completed the post screen?
  {
    accessorKey: "postscreen",
    header: "PostScreen",
  },
  // the date the request was submitted
  {
    accessorKey: "createdat",
    header: "CreatedAt",
  },
  // the string of details submitted to explain the request
  {
    accessorKey: "details",
    header: "Details",
  },
  // the string of implementation details submitted to explain the request
  {
    accessorKey: "implementation",
    header: "Implementation",
  },
  // the string of sustainability details submitted to explain the request
  {
    accessorKey: "sustainability",
    header: "Sustainability",
  },
  // array of SDOH objects { might need to rethink how SDOHs are rendered in this table. Maybe just as a link to a different table with related SDOH objects }
  {
    accessorKey: "sdohs",
    header: "SDOHs",
  },
  // array of RFF objects { might need to rethink how RFFs are rendered in this table. Maybe just as a link to a different table with related RFF objects }
  {
    accessorKey: "rffs",
    header: "RFFs",
  },
];
