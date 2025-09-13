import { PageA } from "@/components/page-a/PageA";
import { AuthApi } from "@/lib/api/auth.api";

async function loadRandom() {
  const res = await AuthApi.veryLongRequest();
}

export default async function PageAPage() {
  await loadRandom();
  return <PageA initialValue={5} />;
}
