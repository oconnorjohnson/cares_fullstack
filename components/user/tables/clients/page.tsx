import { Client, columns } from "@/components/user/tables/clients/columns";
import { DataTable } from "@/components/ui/data-table";
import { requestUsersClients } from "@/server/actions/request/actions";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

async function getClients({ userId }: { userId: string }): Promise<Client[]> {
  const clients = await requestUsersClients(userId);
  const modifiedClients = clients.map((client) => ({
    ...client,
    sex: client.sex || "Error",
    race: client.race || "Error",
    clientId: client.clientID || "Error",
  }));
  return modifiedClients;
}

export default async function UserClients({ userId }: { userId: string }) {
  const clients = await getClients({ userId });
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Clients</CardTitle>
          <CardDescription>
            All of the clients you create are listed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="px-12 mx-auto">
            <DataTable
              columns={columns}
              data={clients}
              defaultSorting={[
                {
                  id: "name",
                  desc: true,
                },
              ]}
              searchPlaceholder="Search requests"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
