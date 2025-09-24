import { DesktopProjectView } from "@/components/app/project/desktop/DesktopProjectView";
import { MobileProjectView } from "@/components/app/project/mobile/MobileProjectView";
import { useNavigate, useParams } from "@tanstack/react-router";
import { BindLogic, useValues } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { useEffect, useState } from "react";
import { authLogic } from "@/lib/logics/authLogic";
import { invitationsLogic } from "@/lib/logics/invitationsLogic";
import { projectSettingsLogic } from "@/lib/logics/projectSettingsLogic";
import { projectsLogic } from "@/lib/logics/projectsLogic";
import { useProjects } from "@/lib/hooks/useProjects";

export function ProjectPage() {
  const { projects } = useValues(projectsLogic);
  const navigate = useNavigate();
  const { isLoggedIn } = useValues(authLogic);

  const { activeProject } = useProjects();

  const projectId = useParams({
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
    }
  }, [projects, activeProject]);

  return (
    <BindLogic logic={projectLogic} props={{ projectId: projectId.projectId }}>
      <BindLogic
        logic={invitationsLogic}
        props={{ projectId: projectId.projectId }}
      >
        <BindLogic
          logic={projectSettingsLogic}
          props={{ projectId: projectId.projectId }}
        >
          <ProjectPageContent />
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
