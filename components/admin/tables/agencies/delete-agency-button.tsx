import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { DeleteAgency } from "@/server/actions/delete/actions";

export default async function DeleteAgencyButton({
  agencyId,
}: {
  agencyId: number;
}) {
  const DeletedAgency = await DeleteAgency(agencyId);
  return (
    <Button className="bg-destructive">
      <TrashIcon />
      Delete
    </Button>
  );
}
