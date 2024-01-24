import { auth, SignedIn } from "@clerk/nextjs";
import ClientDashboard from "@/components/client-dashboard";
import AdminDashboard from "@/components/admin-dashboard";
import Hero from "@/components/hero";

export default function Home() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      <div>{isAdmin ? <AdminDashboard /> : <ClientDashboard />}</div>
    </>
  );
}
