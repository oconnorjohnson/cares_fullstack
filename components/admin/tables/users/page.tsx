import { User, columns } from "@/components/admin/tables/users/columns";
import { DataTable } from "@/components/ui/data-table";
import { GetAllUsers } from "@/server/actions/request/actions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

async function getUsers(): Promise<User[]> {
  const users = await GetAllUsers();
  console.log(users);
  const modifiedUsers = users.map((user) => ({
    ...user,
    id: user.id,
    users: user.first_name + " " + user.last_name,
    emails: user.emailAddresses.map((email) => email.email),
    clients: user.clients
      .map((client) => `${client.first_name} ${client.last_name}`)
      .join(" | "),
  }));
  console.log(JSON.stringify(users, null, 2));
  return modifiedUsers as unknown as User[];
}

export default async function UserTable() {
  const users = await getUsers();
  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={users}
        defaultSorting={[
          {
            id: "users", // Make sure this id matches one of the column accessorKeys
            desc: true,
          },
        ]}
        searchColumn="users"
        searchPlaceholder="Filter users..."
      />
    </div>
  );
}
