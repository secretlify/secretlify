import { createFileRoute, useParams } from "@tanstack/react-router";
import { AcceptInvitationPage } from "@/components/invitation/AcceptInvitationPage";
import { BindLogic } from "kea";
import { acceptInvitationLogic } from "@/lib/logics/acceptInvitationLogic";

export const Route = createFileRoute("/invite/$inviteId")({
  component: AcceptInvitationTanstackPage,
});

function AcceptInvitationTanstackPage() {
  const { inviteId } = useParams({ from: "/invite/$inviteId" });

  return (
    <BindLogic logic={acceptInvitationLogic} props={{ invitationId: inviteId }}>
      <AcceptInvitationPage />
    </BindLogic>
  );
}
