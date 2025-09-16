import { useParams } from "@tanstack/react-router";
import { useValues } from "kea";
import { useMemo } from "react";
import { projectsLogic } from "../logics/projectsLogic";

export function useProjects() {
  const { readProjectById, projects } = useValues(projectsLogic);

  const { projectId } = useParams({
    from: "/app/project/$projectId",
  });

  const activeProject = useMemo(
    () => readProjectById(projectId),
    [projectId, projects]
  );

  return { activeProject };
}
