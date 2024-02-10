"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";

export default function getAgencies() {
  const { data: agencies, isLoading, isError } = trpc.getAgencies.useQuery();
  const trpcContext = trpc.useUtils();
  const deleteAgencyMutation = trpc.deleteAgency.useMutation();
  const handleDeleteAgency = (agencyId: number) => {
    deleteAgencyMutation.mutate(agencyId, {
      onSuccess: () => {
        toast("Agency successfully deleted!");
        console.log("Agency successfully deleted!");
        trpcContext.getAgencies.invalidate();
      },
      onError: (error) => {
        toast("You can not delete an agency that has dependent funds.");
        console.error("Failed to delete agency:", error);
      },
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agencies</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agencies?.map((agency: any) => (
            <TableRow key={agency.id}>
              <TableCell>{agency.name}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      className="bg-destructive"
                      onClick={() => handleDeleteAgency(agency.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
