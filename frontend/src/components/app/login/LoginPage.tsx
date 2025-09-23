import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/GitHubIcon";

export function LoginPage() {
  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const appUrl = import.meta.env.VITE_APP_URL;

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${appUrl}/app/callbacks/oauth/google&response_type=code&scope=openid%20email%20profile`;
    window.location.href = googleOAuthUrl;
  };

  const handleGitHubLogin = () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const appUrl = import.meta.env.VITE_APP_URL;
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${appUrl}/app/callbacks/oauth/github&scope=user:email`;
    window.location.href = githubOAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">
              Welcome to Cryptly
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 h-12"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <Button
              onClick={handleGitHubLogin}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 h-12"
            >
              <GitHubIcon />
              Continue with GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);
