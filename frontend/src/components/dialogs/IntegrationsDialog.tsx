import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState, useEffect } from "react";
import { commonLogic } from "@/lib/logics/commonLogic";

function repositoryFullName(dto: { name?: string; owner?: string }) {
  return `${dto.owner}/${dto.name}`;
}

interface IntegrationsDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
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
          {repositoryFullName(integration.repositoryData!)}
        </div>
        <div className="text-xs text-muted-foreground">
          Repository ID: {integration.githubRepositoryId}
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
  const { integrations } = useValues(integrationsLogic);

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
              key={integration.id}
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

  const { activeProject } = useProjects();
  const { installations, repositories, selectedInstallationEntityId } =
    useValues(integrationsLogic);
  const { createIntegration } = useAsyncActions(integrationsLogic);
  const { setSelectedInstallationEntityId } = useActions(integrationsLogic);
  const { setShouldReopenIntegrationsDialog } = useActions(commonLogic);

  // Reset repository selection when installation changes
  useEffect(() => {
    setSelectedRepository("");
  }, [selectedInstallationEntityId]);

  const handleInstallApp = () => {
    setShouldReopenIntegrationsDialog(true);
    window.location.href = `https://github.com/apps/cryptly-dev/installations/new?state="projectId=${activeProject?.id}"`;
  };

  const handleInstallationSelectChange = (value: string) => {
    if (value === "add-installation") {
      handleInstallApp();
    } else {
      setSelectedInstallationEntityId(value);
    }
  };

  const handleConnectRepository = async () => {
    if (!selectedRepository || !selectedInstallationEntityId) return;

    const repository = repositories.find(
      (repo) => `${repo.owner}/${repo.name}` === selectedRepository
    );

    if (!repository) return;

    setIsLoading(true);
    await createIntegration(
      Number(repository.id),
      Number(selectedInstallationEntityId)
    );
    setIsLoading(false);
    setSelectedRepository(""); // Reset after successful connection
  };

  const isRepositoryDisabled = !selectedInstallationEntityId;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconPlus className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Connect New Repository</h3>
      </div>

      {/* Installation selector on its own line */}
      <Select
        value={selectedInstallationEntityId ?? undefined}
        onValueChange={handleInstallationSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a GitHub installation" />
        </SelectTrigger>
        <SelectContent>
          {installations.map((installation) => (
            <SelectItem key={installation.id} value={installation.id}>
              <div className="flex items-center gap-2">
                {installation.liveData?.avatar && (
                  <img
                    src={installation.liveData.avatar}
                    alt={`${installation.liveData.owner} avatar`}
                    className="size-5 rounded-full"
                  />
                )}
                <span className="truncate">
                  {installation.liveData?.owner ||
                    `Installation ${installation.githubInstallationId}`}
                </span>
              </div>
            </SelectItem>
          ))}
          <SelectItem
            value="add-installation"
            className="text-muted-foreground cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <IconPlus className="size-4" />
              <span>Add new installation</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Repository selector and connect button on the same line */}
      <div className="flex gap-2">
        <Combobox
          options={repositories.map((repo) => ({
            value: `${repo.owner}/${repo.name}`,
            label: `${repo.owner}/${repo.name}`,
            avatarUrl: repo.avatarUrl,
          }))}
          value={selectedRepository}
          onValueChange={setSelectedRepository}
          placeholder="Choose repository"
          searchPlaceholder="Search repositories..."
          emptyMessage="No repositories found."
          className="flex-1"
          disabled={isRepositoryDisabled}
        />

        <Button
          onClick={handleConnectRepository}
          disabled={!selectedRepository || isRepositoryDisabled}
          isLoading={isLoading}
          className="cursor-pointer"
        >
          Connect
        </Button>
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

          <ExistingIntegrationsSection />

          <AddIntegrationSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default IntegrationsDialog;
