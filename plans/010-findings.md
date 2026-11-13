# Plan 010 investigation findings

## Base UI 1.7.0 slider API

- The exact prop type is
  `onValueChange?: ((value: Value extends number ? number : Value, eventDetails: SliderRoot.ChangeEventDetails) => void) | undefined`,
  where `Value extends number | readonly number[]`. The event details include
  the originating event, active thumb index, and a `reason` of `input-change`,
  `track-press`, `drag`, `keyboard`, or `none`.
- `step` controls arrow-key increments (default `1`); `largeStep` controls
  Page Up/Down and Shift + Arrow increments (default `10`).
- `Slider.Thumb` forwards `aria-valuetext` to its nested range input and also
  supports `getAriaValueText(formattedValue, value, index)`.

## Browser checks

### Volume control (`/docs/components/volume-control`)

- Arrow Right changed the focused slider from 0 to 0.01, then 0.02, and unmuted the player. The progress fill is driven by that same volume store value; its visual movement was not separately measured.
- Clicking about 63% along the track moved the value to 0.625.
- Dragging the thumb further right moved the value to 0.890625 without visible jitter.

### Timeline (`/blocks/video-player`)

- Arrow Right sought the paused VOD stream from 0.084 to 5 seconds; the elapsed label changed to 00:05. The step is about 5 seconds.
- Clicking near the middle sought to 315.184 seconds (05:15). Dragging from there to roughly 70% sought to 440.750 seconds (07:20), without visible jump-back or jitter.
- The `Seek To` preview appeared and updated during pointer interaction. A hover-only move was not available through this browser tool, so pure hover remains a reviewer check.
- The homepage stream selector (the block page has no selector) loaded `Shaka Player History (HLS)`. Arrow Left moved its media time from 3592.722 to 3590.161 seconds and exposed a 7-second live latency, within the seek window. The source later reset while paused, so repeated live seeking was not assessed reliably.
- The block renders two Base UI slider thumbs and therefore two range inputs/tab stops. Restructuring the hover thumb is out of this plan's scope.
- The block page logged a hydration mismatch in `components/blocks/block-toolbar.tsx` during dev mode. The player controls worked after client regeneration; the mismatch was not investigated in this plan.
- No VoiceOver or NVDA check was performed.
