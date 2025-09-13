"use client";

import { UserSerialized } from "@/lib/api/user.api";

interface MeProps {
  preloadedData: {
    user: UserSerialized;
  };
}

export function Me(props: MeProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-8 gap-6">
      <h1 className="text-5xl md:text-7xl font-bold">Page A</h1>
      <div className="space-y-2">
        <div className="text-2xl">Email: {props.preloadedData.user.email}</div>
        <div className="text-2xl">
          Auth method: {props.preloadedData.user.authMethod}
        </div>
      </div>
      <button
        className="w-fit rounded-md border border-border px-3 py-1 bg-card text-card-foreground"
        onClick={() => {}}
      >
        Refresh
      </button>
    </div>
  );
}
