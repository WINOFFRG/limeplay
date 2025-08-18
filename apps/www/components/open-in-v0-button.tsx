import { PROD_BASE_HOST } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

// v0 uses the default style.
const V0_STYLE = "default"

export function OpenInV0Button({
  name,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  name: string
}) {
  return (
    <Button
      size="sm"
      asChild
      className={cn("h-[1.8rem] gap-1", className)}
      {...props}
    >
      <a
        href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(`${PROD_BASE_HOST}/r/styles/${V0_STYLE}/${name}.json`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in <Icons.v0 className="size-5" />
      </a>
    </Button>
  )
}
