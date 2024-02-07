import { auth, SignedIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const UserDashboard = dynamic(
  () => import("@/components/dashboards/user-dashboard"),
);
const AdminDashboard = dynamic(
  () => import("@/components/dashboards/admin-dashboard"),
);

export default function Home() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      <div>{isAdmin ? <AdminDashboard /> : <UserDashboard />}</div>
    </>
  );
}
