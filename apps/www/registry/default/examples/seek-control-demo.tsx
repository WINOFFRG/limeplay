import {
  CaretCircleDoubleLeftIcon,
  CaretCircleDoubleRightIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { SeekControl } from "@/registry/default/ui/seek-controls"

export function SeekControlDemo() {
  return (
    <div className="flex items-center gap-2">
      <SeekControl asChild offset={-10}>
        <Button size="icon" variant="ghost">
          <CaretCircleDoubleLeftIcon />
        </Button>
      </SeekControl>
      <SeekControl asChild offset={10}>
        <Button size="icon" variant="ghost">
          <CaretCircleDoubleRightIcon />
        </Button>
      </SeekControl>
    </div>
  )
}
