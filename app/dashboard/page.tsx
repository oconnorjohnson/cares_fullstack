import { auth, SignedIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const UserDashboard = dynamic(
  () => import("@/components/user/dashboard/user-dashboard"),
  { loading: () => <LoadingFallback /> },
);
const AdminDashboard = dynamic(
  () => import("@/components/admin/dashboard/admin-dashboard"),
  { loading: () => <LoadingFallback /> },
);
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
export default function Home() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      <div>{isAdmin ? <AdminDashboard /> : <UserDashboard />}</div>
    </>
  );
}
