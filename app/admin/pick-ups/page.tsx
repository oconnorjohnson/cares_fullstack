import SideNavBar from "@/components/admin/dashboard/side-nav";
export default async function PickUps() {
  return (
    <>
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6 items-center"></div>
      </div>
    </>
  );
}
