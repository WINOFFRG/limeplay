export function createTimeoutSignal(
  signal: AbortSignal | undefined,
  timeoutMs: number
): AbortSignal | undefined {
  if (typeof AbortSignal.timeout !== "function") return signal

  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  if (!signal) return timeoutSignal

  return AbortSignal.any([signal, timeoutSignal])
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (!signal?.aborted) return

  throw new DOMException("Aborted", "AbortError")
}
