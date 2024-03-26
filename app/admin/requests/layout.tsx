import SideNavBar from "@/components/admin/dashboard/side-nav";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row">
      <SideNavBar />
      {children}
    </div>
  );
}
