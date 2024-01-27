"use client";
import { trpc } from "@/app/_trpc/client";

export default function TodoList() {
  const getTodos = trpc.getTodos.useQuery();
  // const addTodo = trpc.addTodo.useMutation({
  // onSettled: () => {
  // getTodos.refetch();
  // }
  // })

  return (
    <div>
      <div>{JSON.stringify(getTodos.data)}</div>
    </div>
  );
}
