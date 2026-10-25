import { describe, expect, it } from 'vitest'
import { formatTimestamp } from '#/components/current-sensor-data/format-timestamp'

describe('formatTimestamp', () => {
  it('formats a valid timestamp for display', () => {
    const timestamp = new Date(2025, 4, 1, 9, 5).toISOString()

    expect(formatTimestamp(timestamp)).toBeTruthy()
  })

  it('returns null for missing or invalid timestamps', () => {
    expect(formatTimestamp(undefined)).toBeNull()
    expect(formatTimestamp('not-a-date')).toBeNull()
  })
})
