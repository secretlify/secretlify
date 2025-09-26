import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { useProjects } from "@/lib/hooks/useProjects";
import { integrationsLogic } from "@/lib/logics/integrationsLogic";
import type { Integration } from "@/lib/api/integrations.api";
import {
  IconLink,
  IconTrash,
  IconBrandGithub,
  IconPlus,
} from "@tabler/icons-react";
import { useActions, useAsyncActions, useValues } from "kea";
import { useState } from "react";
import { commonLogic } from "@/lib/logics/commonLogic";

interface IntegrationsDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

function InstallationStatusSection() {
  const [loading, setLoading] = useState(false);
  const { activeProject } = useProjects();
  const { installation } = useValues(integrationsLogic);
  const { removeInstallationFromProject } = useActions(integrationsLogic);

  const { setShouldReopenIntegrationsDialog } = useActions(commonLogic);

  const handleInstallApp = () => {
    setShouldReopenIntegrationsDialog(true);
    window.location.href = `https://github.com/apps/cryptly-dev/installations/new?state="projectId=${activeProject?.id}"`;
  };

  const handleRemoveInstallation = () => {
    setLoading(true);

    removeInstallationFromProject();

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconBrandGithub className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">GitHub App Installation</h3>
      </div>

      {installation ? (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
          <img
            src={installation.avatar}
            alt={`${installation.owner} avatar`}
            className="size-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground/90 truncate">
              {installation.owner}
            </div>
            <div className="text-xs text-muted-foreground">
              Installation ID: {installation.id}
            </div>
          </div>
          <Button
            onClick={handleRemoveInstallation}
            variant="ghost"
            isLoading={loading}
            size="sm"
            className="cursor-pointer text-destructive hover:text-destructive"
          >
            <IconTrash className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center py-6 px-4 bg-muted/20 rounded-md border border-dashed">
          <IconBrandGithub className="size-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-sm text-muted-foreground mb-4">
            Install the GitHub App to connect repositories with your project.
          </div>
          <Button onClick={handleInstallApp} className="cursor-pointer">
            Install GitHub App
          </Button>
        </div>
      )}
    </div>
  );
}

function IntegrationListItem({ integration }: { integration: Integration }) {
  const [isLoading, setIsLoading] = useState(false);
  const { removeIntegration } = useActions(integrationsLogic);

  const handleRemoveIntegration = () => {
    setIsLoading(true);
    removeIntegration(integration.id);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
      <IconBrandGithub className="size-5 text-foreground/70" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground/90 truncate">
          {integration.fullName}
        </div>
        <div className="text-xs text-muted-foreground">
          Repository ID: {integration.repositoryId}
        </div>
      </div>
      <Button
        onClick={handleRemoveIntegration}
        variant="ghost"
        isLoading={isLoading}
        size="sm"
        className="cursor-pointer text-destructive hover:text-destructive"
      >
        <IconTrash className="size-4" />
      </Button>
    </div>
  );
}

function ExistingIntegrationsSection() {
  const { installation, integrations } = useValues(integrationsLogic);

  if (!installation) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconLink className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Connected Repositories</h3>
      </div>

      {integrations.length > 0 ? (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <IntegrationListItem
              key={integration.repositoryId}
              integration={integration}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 px-4 bg-muted/20 rounded-md border border-dashed">
          <div className="text-sm text-muted-foreground">
            No repositories connected to this project yet.
          </div>
        </div>
      )}
    </div>
  );
}

function AddIntegrationSection() {
  const [selectedRepository, setSelectedRepository] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { installation, repositories } = useValues(integrationsLogic);
  const { createIntegration } = useAsyncActions(integrationsLogic);

  const handleConnectRepository = async () => {
    if (!selectedRepository) return;

    const repository = repositories.find(
      (repo) => repo.fullName === selectedRepository
    );

    if (!repository) return;

    setIsLoading(true);
    await createIntegration(Number(repository.id));
    setIsLoading(false);
  };

  if (!installation) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconPlus className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Connect New Repository</h3>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Combobox
            options={repositories.map((repo) => ({
              value: repo.fullName,
              label: repo.fullName,
              avatarUrl: repo.avatarUrl,
            }))}
            value={selectedRepository}
            onValueChange={setSelectedRepository}
            placeholder="Choose a repository"
            searchPlaceholder="Search repositories..."
            emptyMessage="No repositories found."
            className="flex-1"
          />
          <Button
            onClick={handleConnectRepository}
            disabled={!selectedRepository}
            isLoading={isLoading}
            className="cursor-pointer"
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}

export function IntegrationsDialog({
  open,
  onOpenChange,
}: IntegrationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <div className="grid gap-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Integrations
            </DialogTitle>
            <DialogDescription>
              Connect github repositories to sync and manage your project
              secrets.
            </DialogDescription>
          </DialogHeader>

          <InstallationStatusSection />

          <ExistingIntegrationsSection />

          <AddIntegrationSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default IntegrationsDialog;
