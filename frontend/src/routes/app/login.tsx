import { authLogic } from "@/authLogic";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useActions, useValues } from "kea";

export const Route = createFileRoute("/app/login")({
  component: Login,
});

function Login() {
  const { loginToStore, reset } = useActions(authLogic);
  const { jwtToken } = useValues(authLogic);

  const handleGoogleLogin = () => {
    const googleOAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=456428460773-39vislc8t7omv2h9klmelsklg0497afm.apps.googleusercontent.com&redirect_uri=http://localhost:5173/app/callbacks/oauth/google&response_type=code&scope=openid%20email%20profile&state=PIETY_PAPIESKIE_SA_NIEBIESKIE";
    window.open(googleOAuthUrl);
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Login</h1>
        <Button onClick={handleGoogleLogin}>Login with Google</Button>
        <Button onClick={() => reset()}>Reset</Button>
        <p>JWT Token: {jwtToken}</p>
      </div>
    </>
  );
}
