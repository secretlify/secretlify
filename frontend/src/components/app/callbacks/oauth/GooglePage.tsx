import { authLogic } from "@/lib/logics/authLogic";
import { useActions } from "kea";
import { OAuthCallbackPage } from "./OAuthCallbackPage";

export function GooglePage() {
  const { exchangeGoogleCodeForJwt } = useActions(authLogic);

  return <OAuthCallbackPage exchangeCodeForJwt={exchangeGoogleCodeForJwt} />;
}
