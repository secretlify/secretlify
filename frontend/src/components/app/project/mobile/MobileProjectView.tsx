import { MobileProjectTile } from "./MobileProjectTile";

export function MobileProjectView() {
  return (
    <div className="h-screen-mobile w-full overflow-hidden bg-background text-foreground">
      <MobileProjectTile />
    </div>
  );
}
