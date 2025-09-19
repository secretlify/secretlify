import { DesktopProjectView } from "@/components/app/project/desktop/DesktopProjectView";
import { MobileProjectView } from "@/components/app/project/mobile/MobileProjectView";
import { useParams } from "@tanstack/react-router";
import { BindLogic } from "kea";
import { projectLogic } from "@/lib/logics/projectLogic";
import { useEffect, useState } from "react";

export function ProjectPage() {
  const projectId = useParams({
    from: "/app/project/$projectId",
  });

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
