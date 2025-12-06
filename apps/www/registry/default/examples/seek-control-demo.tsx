import {
  CaretCircleDoubleLeftIcon,
  CaretCircleDoubleRightIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { SeekControl } from "@/registry/default/ui/seek-controls"

export function SeekControlDemo() {
  return (
    <div className="flex items-center gap-2">
      <SeekControl offset={-10} asChild>
        <Button variant="ghost" size="icon">
          <CaretCircleDoubleLeftIcon />
        </Button>
      </SeekControl>
      <SeekControl offset={10} asChild>
        <Button variant="ghost" size="icon">
          <CaretCircleDoubleRightIcon />
        </Button>
      </SeekControl>
    </div>
  )
}
