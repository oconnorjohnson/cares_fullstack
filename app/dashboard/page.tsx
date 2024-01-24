import { auth, SignedIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Hero from "@/components/hero";

const ClientDashboard = dynamic(() => import("@/components/client-dashboard"));
const AdminDashboard = dynamic(() => import("@/components/admin-dashboard"));

export default function Home() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      <div>{isAdmin ? <AdminDashboard /> : <ClientDashboard />}</div>
    </>
  );
}
