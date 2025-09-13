import { PageAClient } from "@/components/page-a-client";
import { AuthApi } from "@/lib/api/auth.api";

async function loadRandom() {
  const res = await AuthApi.veryLongRequest();
}

export default async function PageA() {
  await loadRandom();
  return <PageAClient initialValue={5} />;
}
