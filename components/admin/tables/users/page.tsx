import { User, columns } from "@/components/admin/tables/users/columns";
import { DataTable } from "@/components/ui/data-table";
import { GetAllUsers } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";

async function getUsers(): Promise<User[]> {
  const users = await GetAllUsers();
  console.log(users);
  const modifiedUsers = users.map((user) => ({
    ...user,
    id: user.id,
    users: user.first_name + " " + user.last_name,
    emails: user.EmailAddress.map((email) => email.email),
    clients: user.Client.map((client) => `${client.clientID}`).join(" | "),
  }));
  console.log(JSON.stringify(users, null, 2));
  return modifiedUsers as unknown as User[];
}

export default async function UserTable() {
  const users = await getUsers();
  return (
    <div className="container mx-auto">
      <Card className="p-8">
        <CardHeader className="text-center text-3xl font-bold">
          All Users
        </CardHeader>
        <DataTable
          columns={columns}
          data={users}
          defaultSorting={[
            {
              id: "users",
              desc: true,
            },
          ]}
          searchColumn="users"
          searchPlaceholder="Filter users..."
        />
      </Card>
    </div>
  );
}
