import { Me } from "@/components/me/Me";
import { UserApi } from "@/lib/api/user.api";
import { cookies } from "next/headers";

async function preloadData() {
  const jwtToken = (await cookies()).get("jwt")?.value;

  if (!jwtToken) {
    throw new Error("JWT token not found");
  }

  const user = await UserApi.getMe(jwtToken);

  return {
    user: user,
  };
}

export default async function MePage() {
  const user = await preloadData();
  return <Me preloadedData={user} />;
}
