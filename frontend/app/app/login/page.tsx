"use client";

export default function PageLogin() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-8 gap-6">
      <h1 className="text-5xl md:text-7xl font-bold">Login</h1>
      <button
        className="w-fit rounded-md border border-border px-3 py-1 bg-card text-card-foreground"
        onClick={() => {
          window.location.href = "/api/auth/google";
        }}
      >
        Login using Google
      </button>
    </div>
  );
}
