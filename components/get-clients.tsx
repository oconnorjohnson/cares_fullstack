"use client";
import { trpc } from "@/app/_trpc/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function GetClients({ userId }: { userId: string | null }) {
  console.log("User ID:", userId);
  const {
    data: clients,
    isLoading,
    isError,
  } = trpc.getClients.useQuery(userId as string, {
    enabled: !!userId, // The query will not execute until the userId is available
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching clients.</div>;
  }

  //Render table with the fetched clients
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Date of Birth</TableHead>
          <TableHead>Sex</TableHead>
          <TableHead>Race</TableHead>
          <TableHead>Case Number</TableHead>
          <TableHead>Contact Info</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients?.map((client: any) => (
          <TableRow key={client.id}>
            <TableCell>{client.first_name}</TableCell>
            <TableCell>{client.last_name}</TableCell>
            <TableCell>{client.dateOfBirth}</TableCell>
            <TableCell>{client.sex}</TableCell>
            <TableCell>{client.race}</TableCell>
            <TableCell>{client.caseNumber}</TableCell>
            <TableCell>{client.contactInfo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
