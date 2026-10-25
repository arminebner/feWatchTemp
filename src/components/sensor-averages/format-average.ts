export function formatAverage(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(1)
    : '--'
}
