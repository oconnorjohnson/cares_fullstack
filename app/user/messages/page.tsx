import SideNavBar from "@/components/user/dashboard/side-nav";

export default function UserMessages() {
  return (
    <>
      <div className="flex flex-row">
        <SideNavBar />
        <div className="flex border-t flex-col w-5/6">Messages</div>
      </div>
    </>
  );
}
