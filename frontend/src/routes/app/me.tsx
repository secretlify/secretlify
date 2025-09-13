import { authLogic } from "@/authLogic";
import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import { useEffect } from "react";

export const Route = createFileRoute("/app/me")({
  component: Me,
});

// User Icon component
const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12">
    <path
      fill="currentColor"
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </svg>
);

function Me() {
  const navigate = useNavigate();
  const { userData, isLoggedIn } = useValues(authLogic);
  const { loadUserData, reset } = useActions(authLogic);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/app/login" });
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = () => {
    reset();
    navigate({ to: "/app/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-muted rounded-full text-muted-foreground">
                <img
                  src={userData?.avatarUrl}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-card-foreground mb-2">
              Your Profile
            </h1>
          </div>

          {userData ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <p className="text-lg font-medium text-card-foreground mt-1">
                    {userData.email}
                  </p>
                </div>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">
                    Actions
                  </span>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Loading your profile...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
