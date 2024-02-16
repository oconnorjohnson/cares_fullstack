import SideNavBar from "@/components/user/dashboard/side-nav";

export default function UserMessages() {
  return (
    <>
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6">
          <div className="flex flex-row justify-between py-6"></div>
          <div className="text-3xl font-bold pl-12">My Messages</div>
        </div>
      </div>
    </>
  );
}
