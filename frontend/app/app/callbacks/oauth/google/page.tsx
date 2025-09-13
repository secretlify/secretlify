import { AuthApi } from "@/lib/api/auth.api";

export type GoogleCallbackPageProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function GoogleCallbackPage({
  searchParams,
}: GoogleCallbackPageProps) {
  const rawCode = searchParams?.code;
  const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;

  let apiResponse: unknown = null;
  let apiError: string | null = null;

  if (code) {
    try {
      apiResponse = await AuthApi.loginGoogle(code);
    } catch (error) {
      apiError = error instanceof Error ? error.message : "Unknown error";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background text-foreground">
      <div className="w-full max-w-3xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Google OAuth Callback
        </h1>
        <p className="text-sm text-muted-foreground">
          Displaying the authorization code from the URL
        </p>
        <div className="mt-6 rounded-md border border-border bg-card text-card-foreground p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            code
          </div>
          <pre className="whitespace-pre-wrap break-all text-left font-mono text-sm md:text-base">
            {code ?? "No code found in query string."}
          </pre>
        </div>

        <div className="mt-6 rounded-md border border-border bg-card text-card-foreground p-6 text-left">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            response
          </div>
          {!code && (
            <div className="text-sm text-muted-foreground">
              Cannot call API without a code.
            </div>
          )}
          {code && apiError && (
            <pre className="whitespace-pre-wrap break-all font-mono text-red-400 text-sm md:text-base">
              {apiError}
            </pre>
          )}
          {code && !apiError && (
            <pre className="whitespace-pre-wrap break-all font-mono text-sm md:text-base">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
