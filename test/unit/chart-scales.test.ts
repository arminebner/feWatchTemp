import { describe, expect, it } from 'vitest'
import {
  formatTime,
  getExpandedDomain,
  getTimeScale,
} from '#/components/current-day-sensor-chart/chart-scales'

describe('formatTime', () => {
  it('formats timestamps as local hours and minutes', () => {
    expect(formatTime(new Date(2025, 4, 1, 9, 5).getTime())).toBe('09:05')
  })

  it('returns the original text for an invalid date', () => {
    expect(formatTime('not-a-date')).toBe('not-a-date')
  })
})

describe('getTimeScale', () => {
  it('creates regular ticks and always includes the domain end', () => {
    const start = new Date(2025, 4, 1, 0, 0).getTime()
    const end = new Date(2025, 4, 1, 23, 59, 59, 999).getTime()
    const scale = getTimeScale(start, end, 120)
    const firstTick = scale.ticks[0] ?? Number.NaN
    const secondTick = scale.ticks[1] ?? Number.NaN
    const thirdTick = scale.ticks[2] ?? Number.NaN
    const finalTick = scale.ticks[scale.ticks.length - 1] ?? Number.NaN

    expect(scale.domain).toEqual([start, end])
    expect(firstTick).toBe(start)
    expect(finalTick).toBe(end)
    expect(secondTick - firstTick).toBe(120 * 60 * 1000)
    expect(thirdTick - secondTick).toBe(120 * 60 * 1000)
    expect(formatTime(firstTick)).toBe('00:00')
    expect(formatTime(finalTick)).toBe('23:59')
  })

  it('rejects invalid domains and intervals', () => {
    expect(() => getTimeScale(10, 10, 60)).toThrow(RangeError)
    expect(() => getTimeScale(10, 0, 60)).toThrow(RangeError)
    expect(() => getTimeScale(0, 60_000, 0)).toThrow(RangeError)
  })
})

describe('getExpandedDomain', () => {
  it('pads the data range to make small changes visible', () => {
    expect(getExpandedDomain([20, 22], 0.5)).toEqual([19.5, 22.5])
  })

  it('uses minimum padding when all readings are the same', () => {
    expect(getExpandedDomain([50, 50], 1)).toEqual([49, 51])
  })

  it('ignores missing and non-finite values', () => {
    expect(getExpandedDomain([undefined, Number.NaN, 30, 32], 0.5)).toEqual([
      29.5, 32.5,
    ])
  })

  it('returns a safe default for an empty series and rejects invalid padding', () => {
    expect(getExpandedDomain([], 1)).toEqual([0, 1])
    expect(() => getExpandedDomain([1], -1)).toThrow(RangeError)
  })
})
