import { auth, SignedIn, SignedOut } from "@clerk/nextjs";
import ClientDashboard from "@/components/client-dashboard";
import AdminDashboard from "@/components/admin-dashboard";
import Hero from "@/components/hero";

export default function Home() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
  return (
    <>
      <main>
        <SignedOut>
          <Hero />
        </SignedOut>
        <SignedIn>
          {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
        </SignedIn>
      </main>
    </>
  );
}
