import { authLogic } from "@/lib/logics/authLogic";
import { useActions } from "kea";
import { OAuthCallbackPage } from "./OAuthCallbackPage";

export function GithubPage() {
  const { exchangeGithubCodeForJwt } = useActions(authLogic);

  return <OAuthCallbackPage exchangeCodeForJwt={exchangeGithubCodeForJwt} />;
}
