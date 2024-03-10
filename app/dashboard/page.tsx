import { auth, SignedIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const UserDashboard = dynamic(
  () => import("@/components/user/dashboard/user-dashboard"),
);
const AdminDashboard = dynamic(
  () => import("@/components/admin/dashboard/admin-dashboard"),
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
export const runtime = "edge";
