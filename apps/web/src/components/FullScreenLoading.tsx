import { useTheme } from "@usesend/ui";
import Image from "next/image";
import { useBranding } from "~/providers/branding-context";

export const FullScreenLoading = () => {
  const { resolvedTheme } = useTheme();
  const { appName } = useBranding();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Image
        src={"/logo-squircle.png"}
        alt="{appName}"
        width={45}
        height={45}
        className="mx-auto"
      />
    </div>
  );
};
