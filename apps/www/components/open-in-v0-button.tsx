import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { PROD_BASE_HOST } from "@/lib/constants"
import { cn } from "@/lib/utils"

// v0 uses the default style.
const V0_STYLE = "default"

export function OpenInV0Button({
  className,
  name,
  ...props
}: React.ComponentProps<"a"> & {
  name: string
}) {
  return (
    <a
      className={cn(buttonVariants({ size: "sm" }), "h-8 gap-1", className)}
      href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : PROD_BASE_HOST}/r/styles/${V0_STYLE}/${name}.json`)}`}
      rel="noopener noreferrer"
      target="_blank"
      {...props}
    >
      Open in <Icons.v0 className="size-5" />
    </a>
  )
}
