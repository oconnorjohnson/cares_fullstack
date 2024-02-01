"use client";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  Terminal,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from "lucide-react";
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
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function GetClients({ userId }: { userId: string | null }) {
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
  }
  if (clients && clients.length === 0) {
    // Display a message if there are no clients
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Click on <strong>Add New Client</strong> to get started!
        </AlertDescription>
      </Alert>
    );
  } else {
    return (
      <>
        <div className="font-bold text-2xl">My Clients</div>
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
              {/* <TableHead className="text-destructive">Danger</TableHead> */}
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
                <TableCell>
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {/* <DialogTrigger asChild>
                          <DropdownMenuItem
                          // onSelect={() => openConfirmDialog(client.id)}
                          >
                            <div className="flex text-md flex-row items-center">
                              <PlusIcon size={15} />
                              <div className="px-1" />
                              New Request
                            </div>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <div className="py-1" /> */}
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                          // onSelect={() => openConfirmDialog(client.id)}
                          >
                            <div className="flex text-md flex-row items-center">
                              <EditIcon size={15} />
                              <div className="px-1" />
                              Edit
                            </div>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <div className="py-1" />
                        <DropdownMenuItem
                          onSelect={() => openConfirmDialog(client.id)}
                          className="bg-red-600 text-white"
                        >
                          <div className="flex text-md flex-row items-center">
                            <TrashIcon size={15} />
                            <div className="px-1" />
                            Delete
                          </div>
                        </DropdownMenuItem>
                        {/* Add more menu items here as needed */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Client Details</DialogTitle>
                        <DialogDescription>
                          Update your client's information as necessary.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="first_name" className="text-right">
                            First Name
                          </Label>
                          <Input
                            id="first_name"
                            defaultValue={client.first_name}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="last_name" className="text-right">
                            Last Name
                          </Label>
                          <Input
                            id="last_name"
                            defaultValue={client.last_name}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sex" className="text-right">
                            Sex
                          </Label>
                          <Input
                            id="sex"
                            defaultValue={client.sex}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="race" className="text-right">
                            Race
                          </Label>
                          <Input
                            id="race"
                            defaultValue={client.race}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="caseNumber" className="text-right">
                            Case Number
                          </Label>
                          <Input
                            id="caseNumber"
                            defaultValue={client.caseNumber}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="contactInfo" className="text-right">
                            Contact Info
                          </Label>
                          <Input
                            id="contactInfo"
                            defaultValue={client.contactInfo}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <div className="flex justify-between w-full">
                          <div className="flex justify-start">
                            <DialogClose asChild>
                              <Button>Cancel</Button>
                            </DialogClose>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Save changes</Button>
                          </div>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
