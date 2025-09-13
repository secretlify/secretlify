"use client";

export default function PageLogin() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-8 gap-6">
      <h1 className="text-5xl md:text-7xl font-bold">Login</h1>
      <button
        className="w-fit rounded-md border border-border px-3 py-1 bg-card text-card-foreground"
        onClick={() => {
          window.location.href =
            "https://accounts.google.com/o/oauth2/v2/auth?client_id=456428460773-39vislc8t7omv2h9klmelsklg0497afm.apps.googleusercontent.com&redirect_uri=http://localhost:3001/app/callbacks/oauth/google&response_type=code&scope=openid%20email%20profile&state=PIETY_PAPIESKIE_SA_NIEBIESKIE";
        }}
      >
        Login using Google
      </button>
    </div>
  );
}
