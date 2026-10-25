import { describe, expect, it } from 'vitest'
import type { SensorName, SensorValues } from '#/lib/sensor-types'
import { toChartPoints } from '#/components/current-day-sensor-chart/chart-data'

function reading(
  deviceName: SensorName,
  hour: number,
  minute: number,
  second: number,
  temperature: number,
  humidity: number,
): SensorValues {
  return {
    deviceName,
    temperature,
    humidity,
    timestamp: new Date(2025, 4, 1, hour, minute, second).toISOString(),
  }
}

describe('toChartPoints', () => {
  it('keeps the latest reading for each sensor in each 10-minute bucket', () => {
    const points = toChartPoints(
      [
        reading('Sensor_1', 12, 1, 10, 20, 40),
        reading('Sensor_2', 12, 2, 5, 21, 41),
        reading('Sensor_1', 12, 9, 50, 22, 42),
        reading('Sensor_1', 12, 10, 0, 23, 43),
      ],
      10,
    )

    expect(points).toEqual([
      {
        time: new Date(2025, 4, 1, 12, 0).getTime(),
        sensor1Temperature: 22,
        sensor1Humidity: 42,
        sensor2Temperature: 21,
        sensor2Humidity: 41,
      },
      {
        time: new Date(2025, 4, 1, 12, 10).getTime(),
        sensor1Temperature: 23,
        sensor1Humidity: 43,
      },
    ])
  })

  it('combines readings with different seconds into the same minute bucket', () => {
    const points = toChartPoints(
      [
        reading('Sensor_1', 8, 15, 2, 19, 50),
        reading('Sensor_2', 8, 15, 20, 20, 45),
        reading('Sensor_1', 8, 15, 58, 19.5, 51),
      ],
      1,
    )

    expect(points).toEqual([
      {
        time: new Date(2025, 4, 1, 8, 15).getTime(),
        sensor1Temperature: 19.5,
        sensor1Humidity: 51,
        sensor2Temperature: 20,
        sensor2Humidity: 45,
      },
    ])
  })

  it('returns points in chronological order', () => {
    const points = toChartPoints(
      [
        reading('Sensor_1', 13, 0, 0, 21, 40),
        reading('Sensor_1', 9, 30, 0, 20, 41),
      ],
      10,
    )

    expect(points.map((point) => point.time)).toEqual([
      new Date(2025, 4, 1, 9, 30).getTime(),
      new Date(2025, 4, 1, 13, 0).getTime(),
    ])
  })

  it('rejects invalid timestamps and bucket intervals', () => {
    const invalidReading: SensorValues = {
      deviceName: 'Sensor_1',
      temperature: 20,
      humidity: 40,
      timestamp: 'not-a-date',
    }

    expect(() => toChartPoints([invalidReading], 10)).toThrow(
      'Sensor data contains an invalid timestamp',
    )
    expect(() => toChartPoints([], 0)).toThrow(RangeError)
    expect(() => toChartPoints([], 7)).toThrow(RangeError)
  })
})
