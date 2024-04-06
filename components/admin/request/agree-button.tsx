import { Button } from "@/components/ui/button";
import { addAdminAgreementToRequest } from "@/server/actions/update/actions";

export default function AgreeButton({
  userId,
  requestId,
}: {
  userId: string;
  requestId: number;
}) {
  const onClick = async () => {
    await addAdminAgreementToRequest({ userId, requestId });
  };
  return (
    <>
      <Button onClick={onClick}>Agree</Button>
    </>
  );
}
