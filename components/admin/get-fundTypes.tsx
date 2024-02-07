"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export default function getFundTypes() {
  const { data: fundTypes, isLoading, isError } = trpc.getFundTypes.useQuery();
  const trpcContext = trpc.useUtils();
  const deleteFundTypeMutation = trpc.deleteFundType.useMutation();
  const handleDeleteFundType = (fundTypeId: number) => {
    deleteFundTypeMutation.mutate(fundTypeId, {
      onSuccess: () => {
        toast("Fund type successfully deleted!");
        console.log("Fund type successfully deleted!");
        trpcContext.getFundTypes.invalidate();
      },
      onError: (error) => {
        toast("You can not delete a fund type that has dependent funds.");
        console.error("Failed to delete fund type:", error);
      },
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fund Types</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fundTypes?.map((fundType: any) => (
            <TableRow key={fundType.id}>
              <TableCell>{fundType.typeName}</TableCell>
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
                      className="text-destructive"
                      onClick={() => handleDeleteFundType(fundType.id)}
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
