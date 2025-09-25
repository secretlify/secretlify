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
import { IconLink, IconTrash, IconBrandGithub } from "@tabler/icons-react";
import { useState } from "react";

interface IntegrationsDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Mock data - will be replaced with API calls in the future
const MOCK_INTEGRATION = {
  id: "github-123",
  name: "GitHub (secretlify-org)",
  type: "github",
};

const MOCK_REPOSITORIES = [
  { id: "repo-1", name: "secretlify/backend" },
  { id: "repo-2", name: "secretlify/frontend" },
  { id: "repo-3", name: "secretlify/docs" },
  { id: "repo-4", name: "secretlify/mobile" },
];

function IntegrationsSection() {
  // Mock state - will be replaced with actual integration logic
  const [hasIntegration, setHasIntegration] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState<string>("");

  const handleAddIntegration = () => {
    // Open GitHub App installation page
    window.open(
      "https://github.com/apps/SecretAppTestAW/installations/new",
      "_blank"
    );
  };

  const handleRemoveIntegration = () => {
    // Mock removal - will be replaced with API call
    setHasIntegration(false);
    setSelectedRepository("");
  };

  const handleMockAddIntegration = () => {
    // Mock adding integration for testing
    setHasIntegration(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconLink className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">GitHub Integration</h3>
      </div>

      {hasIntegration ? (
        <div className="space-y-4">
          {/* Integration Status */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
            <IconBrandGithub className="size-5 text-foreground/70" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground/90 truncate">
                {MOCK_INTEGRATION.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Connected integration
              </div>
            </div>
            <Button
              onClick={handleRemoveIntegration}
              variant="ghost"
              size="sm"
              className="cursor-pointer text-destructive hover:text-destructive"
            >
              <IconTrash className="size-4" />
            </Button>
          </div>

          {/* Repository Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/90">
              Select Repository
            </label>
            <Select
              value={selectedRepository}
              onValueChange={setSelectedRepository}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a repository" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_REPOSITORIES.map((repo) => (
                  <SelectItem key={repo.id} value={repo.id}>
                    {repo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-6 px-4 bg-muted/20 rounded-md border border-dashed">
            <IconBrandGithub className="size-8 text-muted-foreground mx-auto mb-3" />
            <div className="text-sm text-muted-foreground mb-4">
              Connect your GitHub account to sync secrets with your
              repositories.
            </div>
            <Button onClick={handleAddIntegration} className="cursor-pointer">
              Add Integration
            </Button>
            {/* Temporary mock button for testing */}
            <Button
              onClick={handleMockAddIntegration}
              variant="outline"
              size="sm"
              className="ml-2 cursor-pointer"
            >
              Mock Add (Test)
            </Button>
          </div>
        </div>
      )}
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

          <IntegrationsSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default IntegrationsDialog;
