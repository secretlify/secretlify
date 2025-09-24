import { Button } from "@/components/ui/button";
import { authLogic } from "@/lib/logics/authLogic";
import { useNavigate } from "@tanstack/react-router";
import { useActions, useValues } from "kea";
import { motion } from "motion/react";
import { useEffect } from "react";

export function MePage() {
  const navigate = useNavigate();
  const { userData, isLoggedIn } = useValues(authLogic);
  const { loadUserData, logout } = useActions(authLogic);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/app/login" });
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: [0, 1, 0, 1] },
    },
  } as const;

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          className="bg-card rounded-xl shadow-lg border border-border p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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
              onClick={logout}
              variant="secondary"
              size="lg"
              className="w-full cursor-pointer"
            >
              Log out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
