import React from "react"

interface CustomDemoControlsProps extends React.PropsWithChildren {
  trailingSlot?: React.ReactNode
}

export function CustomDemoControls({
  children,
  trailingSlot,
}: CustomDemoControlsProps) {
  return (
    <section className="relative overflow-hidden">
      <svg className="pointer-events-none absolute top-0 left-0 z-10 h-px w-full">
        <line
          className="text-border"
          stroke="currentColor"
          strokeDasharray="8 4"
          strokeWidth="1"
          x1="0"
          x2="100%"
          y1="0"
          y2="0"
        />
      </svg>

      <svg className="pointer-events-none absolute bottom-0 left-0 z-10 h-px w-full">
        <line
          className="text-border"
          stroke="currentColor"
          strokeDasharray="8 4"
          strokeWidth="1"
          x1="0"
          x2="100%"
          y1="0"
          y2="0"
        />
      </svg>

      <div className="px-8 py-4">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">{children}</div>
          {trailingSlot ? (
            <div className="relative z-20 ml-auto shrink-0">{trailingSlot}</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
