import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PROD_BASE_HOST } from "@/lib/constants";
import { cn } from "@/lib/utils";

// v0 uses the default style.
const V0_STYLE = "default";

export function OpenInV0Button({
  name,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  name: string;
}) {
  return (
    <Button asChild className={cn("h-8 gap-1", className)} size="sm" {...props}>
      <a
        href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : PROD_BASE_HOST}/r/styles/${V0_STYLE}/${name}.json`)}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Open in <Icons.v0 className="size-5" />
      </a>
    </Button>
  );
}
