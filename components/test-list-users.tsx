// In src/app/ListUsers.tsx
"use client";
import { trpc } from "@/lib/trpc";
import React from "react";

export default function ListUsers() {
  const { data: users, isLoading } = trpc.getUsers.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {users?.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </>
  );
}
