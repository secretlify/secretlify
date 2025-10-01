import { createFileRoute, Outlet } from "@tanstack/react-router";
import Waves from "@/components/Waves";

const AppLayout = () => (
  <div className="relative min-h-screen">
    {/* Background Waves - persists across all /app routes */}
    <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
      <Waves
        lineColor="rgba(100, 100, 100, 1)"
        backgroundColor="transparent"
        waveSpeedX={0.01}
        waveSpeedY={0.005}
        waveAmpX={25}
        waveAmpY={25}
      />
    </div>

    {/* Content */}
    <div className="relative z-10">
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute("/app")({
  component: AppLayout,
});
