import { DesktopProjectView } from "@/components/app/project/desktop/DesktopProjectView";
import { MobileProjectView } from "@/components/app/project/mobile/MobileProjectView";
import { useNavigate, useParams } from "@tanstack/react-router";
import { BindLogic, useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { useEffect, useState } from "react";
import { authLogic } from "@/lib/logics/authLogic";

export function ProjectPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useValues(authLogic);

  const projectId = useParams({
    from: "/app/project/$projectId",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/app/login" });
    }
  }, []);

  return (
    <BindLogic logic={projectLogic} props={{ projectId: projectId.projectId }}>
      <ProjectPageContent />
    </BindLogic>
  );
}

function ProjectPageContent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile ? <MobileProjectView /> : <DesktopProjectView />;
}
