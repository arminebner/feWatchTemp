import { format } from 'date-fns'

export function formatTime(value: string | number) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : format(date, 'HH:mm')
}

export function getTimeScale(
  start: number,
  end: number,
  tickIntervalMinutes: number,
) {
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new RangeError('Time scale end must be after its start')
  }
  if (!Number.isInteger(tickIntervalMinutes) || tickIntervalMinutes <= 0) {
    throw new RangeError('Tick interval must be a positive integer')
  }

  const interval = tickIntervalMinutes * 60 * 1000
  const ticks: number[] = []

  for (let tick = start; tick <= end; tick += interval) {
    ticks.push(tick)
  }
  if (ticks[ticks.length - 1] !== end) {
    ticks.push(end)
  }

  return { domain: [start, end] as [number, number], ticks }
}

export function getExpandedDomain(
  values: (number | undefined)[],
  minimumPadding: number,
): [number, number] {
  if (!Number.isFinite(minimumPadding) || minimumPadding < 0) {
    throw new RangeError('minimumPadding must be a non-negative number')
  }

  const validValues = values.filter(
    (value): value is number =>
      typeof value === 'number' && Number.isFinite(value),
  )
  if (validValues.length === 0) {
    return [0, 1]
  }

  const { min, max } = validValues.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  )
  const padding = Math.max((max - min) * 0.15, minimumPadding)

  return [
    Math.floor((min - padding) * 10) / 10,
    Math.ceil((max + padding) * 10) / 10,
  ]
}
