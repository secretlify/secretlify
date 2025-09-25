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
import { useActions, useValues } from "kea";
import { useEffect, useState } from "react";

interface IntegrationsDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Mock data for existing integrations - will be replaced with API calls
const MOCK_EXISTING_INTEGRATIONS: Integration[] = [
  {
    projectId: "project-1",
    repositoryId: "123456",
    publicKey:
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",
    publicKeyId: "key-1",
    name: "my-app-backend",
    owner: "mycompany",
    fullName: "mycompany/my-app-backend",
  },
  {
    projectId: "project-1",
    repositoryId: "789012",
    publicKey:
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8B...",
    publicKeyId: "key-2",
    name: "my-app-frontend",
    owner: "mycompany",
    fullName: "mycompany/my-app-frontend",
  },
];

// Mock installation data
const MOCK_INSTALLATION = {
  id: "github-installation-123",
  name: "MyCompany Organization",
  type: "github",
};

function InstallationStatusSection() {
  const [loading, setLoading] = useState(false);
  const { activeProject } = useProjects();
  const { githubInstallationId } = useValues(integrationsLogic);
  const { removeInstallationFromProject } = useActions(integrationsLogic);

  const handleInstallApp = () => {
    // Open GitHub App installation page
    window.open(
      `https://github.com/apps/SecretAppTestAW/installations/new?state=\"projectId=${activeProject?.id}\"`,
      "_blank"
    );
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

      {githubInstallationId ? (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
          <IconBrandGithub className="size-5 text-foreground/70" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground/90 truncate">
              {MOCK_INSTALLATION.name}
            </div>
            <div className="text-xs text-muted-foreground">
              Installation ID: {githubInstallationId}
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

function ExistingIntegrationsSection() {
  const [loadingIntegrationId, setLoadingIntegrationId] = useState<string>("");
  const { githubInstallationId } = useValues(integrationsLogic);

  const handleRemoveIntegration = (integration: Integration) => {
    setLoadingIntegrationId(integration.repositoryId);

    // Simulate API call
    setTimeout(() => {
      setLoadingIntegrationId("");
      console.log(`Removing integration for ${integration.fullName}`);
    }, 2000);
  };

  // Only show this section if there's an installation
  if (!githubInstallationId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconLink className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Connected Repositories</h3>
      </div>

      {MOCK_EXISTING_INTEGRATIONS.length > 0 ? (
        <div className="space-y-3">
          {MOCK_EXISTING_INTEGRATIONS.map((integration) => (
            <div
              key={integration.repositoryId}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-md"
            >
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
                onClick={() => handleRemoveIntegration(integration)}
                variant="ghost"
                isLoading={loadingIntegrationId === integration.repositoryId}
                size="sm"
                className="cursor-pointer text-destructive hover:text-destructive"
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
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
  const [isConnecting, setIsConnecting] = useState(false);

  const { githubInstallationId, repositories } = useValues(integrationsLogic);

  const handleConnectRepository = () => {
    if (!selectedRepository) return;

    setIsConnecting(true);

    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false);
      console.log(`Connecting repository: ${selectedRepository}`);
      setSelectedRepository("");
    }, 2000);
  };

  useEffect(() => {
    console.log(repositories);
  }, [repositories]);

  // Only show this section if there's an installation
  if (!githubInstallationId) {
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
              value: repo.name,
              label: repo.name,
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
            isLoading={isConnecting}
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
              Connect external services to sync and manage your project secrets.
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
