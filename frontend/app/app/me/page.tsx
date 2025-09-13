import { Me } from "@/components/me/Me";
import { AuthApi } from "@/lib/api/auth.api";

async function loadRandom() {
  const res = await AuthApi.veryLongRequest();
}

export default async function MePage() {
  await loadRandom();
  return <Me initialValue={5} />;
}
