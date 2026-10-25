import { describe, expect, it } from 'vitest'
import { formatAverage } from '#/components/sensor-averages/format-average'

describe('formatAverage', () => {
  it('formats finite values to one decimal place', () => {
    expect(formatAverage(21.26)).toBe('21.3')
    expect(formatAverage(21)).toBe('21.0')
  })

  it('shows a placeholder for missing or non-finite values', () => {
    expect(formatAverage(null)).toBe('--')
    expect(formatAverage(undefined)).toBe('--')
    expect(formatAverage(Number.NaN)).toBe('--')
    expect(formatAverage(Number.POSITIVE_INFINITY)).toBe('--')
  })
})
