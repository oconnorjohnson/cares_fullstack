import CurrentUser from "@/components/current-user";
import TestList from "@/components/test-list-users";

export default function Dashboard() {
  return (
    <>
      <div className="">
        <div className="flex flex-row justify-center">
          <CurrentUser /> You are an admin.
          <TestList />
        </div>
      </div>
    </>
  );
}
