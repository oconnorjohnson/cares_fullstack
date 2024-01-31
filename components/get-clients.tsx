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
import { format, parseISO } from "date-fns";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function GetClients({ userId }: { userId: string | null }) {
  console.log("User ID:", userId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const {
    data: clients,
    isLoading,
    isError,
  } = trpc.getClients.useQuery(userId as string, {
    enabled: !!userId,
  });
  const trpcContext = trpc.useUtils();
  const deleteClientMutation = trpc.deleteClient.useMutation();
  const handleDeleteClient = (clientId: number) => {
    deleteClientMutation.mutate(clientId, {
      onSuccess: () => {
        toast("Client successfully deleted!");
        console.log("Client successfully deleted!");
        trpcContext.getClients.invalidate();
      },
      onError: (error) => {
        toast("Error deleting client.");
        console.error("Failed to delete client:", error);
      },
    });
  };
  const openConfirmDialog = (clientId: number) => {
    setSelectedClientId(clientId);
    setIsDialogOpen(true);
  };
  const handleConfirmDeleteDirectly = () => {
    if (confirmationText === "Delete" && selectedClientId) {
      handleDeleteClient(selectedClientId);
      closeConfirmDialog();
    } else {
      toast("You must type 'Delete' to confirm.");
    }
  };
  const closeConfirmDialog = () => {
    setIsDialogOpen(false);
    setSelectedClientId(null);
    setConfirmationText("");
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching clients.</div>;
  } else {
    return (
      <>
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
              <TableHead className="text-destructive">Danger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client: any) => (
              <TableRow key={client.id}>
                <TableCell>{client.first_name}</TableCell>
                <TableCell>{client.last_name}</TableCell>
                <TableCell>
                  {format(parseISO(client.dateOfBirth), "MM/dd/yyyy")}
                </TableCell>
                <TableCell>{client.sex}</TableCell>
                <TableCell>{client.race}</TableCell>
                <TableCell>{client.caseNumber}</TableCell>
                <TableCell>{client.contactInfo}</TableCell>
                <TableCell className="text-destructive">
                  <Button
                    onClick={() => openConfirmDialog(client.id)}
                    variant="destructive"
                    size="icon"
                  >
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <Input
              placeholder="Type 'Delete' to confirm"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <DialogClose asChild>
                <Button onClick={closeConfirmDialog}>Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleConfirmDeleteDirectly}
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
