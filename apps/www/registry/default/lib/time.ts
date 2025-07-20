import { intervalToDuration } from "date-fns"

const MAX_SAFE_SECONDS = 8.64e12

export function formatTimestamp(seconds: number, showHours = false): string {
  if (!Number.isFinite(seconds) || seconds <= 0 || seconds > MAX_SAFE_SECONDS) {
    return showHours ? "00:00:00" : "00:00"
  }

  const totalSeconds = Math.floor(seconds)
  const HH = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0")
  const MM = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0")
  const SS = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0")

  return showHours ? `${HH}:${MM}:${SS}` : `${MM}:${SS}`
}

export function durationDateTime(durationSeconds: number) {
  const duration = intervalToDuration({
    start: 0,
    end: durationSeconds * 1000,
  })
  const weeks = Math.floor((duration.days ?? 0) / 7)
  const days = (duration.days ?? 0) % 7
  const hours = duration.hours ?? 0
  const minutes = duration.minutes ?? 0
  const seconds = duration.seconds ?? 0

  const dateParts = [weeks > 0 ? `${weeks}W` : "", days > 0 ? `${days}D` : ""]
  const timeParts = [
    hours > 0 ? `${hours}H` : "",
    minutes > 0 ? `${minutes}M` : "",
    seconds > 0 ? `${seconds}S` : "",
  ]

  return "P" + dateParts.join("") + "T" + timeParts.join("")
}
