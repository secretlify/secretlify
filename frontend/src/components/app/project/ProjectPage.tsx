import { DesktopProjectView } from "@/components/app/project/desktop/DesktopProjectView";
import { MobileProjectView } from "@/components/app/project/mobile/MobileProjectView";
import { useProjects } from "@/lib/hooks/useProjects";
import { authLogic } from "@/lib/logics/authLogic";
import { integrationsLogic } from "@/lib/logics/integrationsLogic";
import { invitationsLogic } from "@/lib/logics/invitationsLogic";
import { projectLogic } from "@/lib/logics/projectLogic";
import { projectSettingsLogic } from "@/lib/logics/projectSettingsLogic";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useNavigate, useParams } from "@tanstack/react-router";
import { BindLogic, useValues } from "kea";
import { useEffect, useState } from "react";

export function ProjectPage() {
  const { projects } = useValues(projectsLogic);
  const navigate = useNavigate();
  const { isLoggedIn } = useValues(authLogic);

  const { activeProject } = useProjects();

  const { projectId } = useParams({
    from: "/app/project/$projectId",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/app/login" });
    }
  }, []);

  useEffect(() => {
    if (
      projects.length &&
      !projects.find((project) => project.id === activeProject?.id)
    ) {
      navigate({
        to: "/app/project/$projectId",
        params: { projectId: projects[0].id },
      });
    } else if (projects.length === 0) {
      navigate({ to: "/app/project" });
    }
  }, [projects, activeProject]);

  return (
    <BindLogic logic={projectLogic} props={{ projectId }}>
      <BindLogic logic={invitationsLogic} props={{ projectId }}>
        <BindLogic logic={projectSettingsLogic} props={{ projectId }}>
          <BindLogic logic={integrationsLogic} props={{ projectId }}>
            <ProjectPageContent />
          </BindLogic>
        </BindLogic>
      </BindLogic>
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
