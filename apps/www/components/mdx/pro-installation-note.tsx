import { LockKeyhole } from "lucide-react"

export function ProInstallationNote() {
  return (
    <div className="not-prose mb-4 flex gap-3 rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground">
      <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p className="m-0 leading-relaxed">
        Pro blocks require Limeplay Pro access. Coming Soon!
      </p>
    </div>
  )
}
