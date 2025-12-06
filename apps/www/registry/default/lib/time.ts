import type shaka from "shaka-player"

import { intervalToDuration } from "date-fns/intervalToDuration"

const MAX_SAFE_SECONDS = 8.64e12

export function durationDateTime(
  durationSeconds: number,
  seekRange?: shaka.extern.BufferedRange
) {
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
    return "PT0S"
  }

  // TODO: There is a possible bug here as seekRange returns in seconds
  const duration = intervalToDuration(
    seekRange ?? {
      end: durationSeconds * 1000,
      start: 0,
    }
  )

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

  const dateStr = dateParts.join("")
  const timeStr = timeParts.join("")

  if (!dateStr && !timeStr) {
    return "PT0S"
  }

  return "P" + dateStr + "T" + timeStr
}

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
