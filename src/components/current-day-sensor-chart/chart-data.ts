import type { SensorValues } from '#/lib/sensor-types'

export type SensorChartPoint = {
  time: number
  sensor1Temperature?: number
  sensor1Humidity?: number
  sensor2Temperature?: number
  sensor2Humidity?: number
}

export function toChartPoints(
  sensorValues: SensorValues[],
  bucketMinutes: number,
): SensorChartPoint[] {
  if (
    !Number.isInteger(bucketMinutes) ||
    bucketMinutes < 1 ||
    bucketMinutes > 60 ||
    60 % bucketMinutes !== 0
  ) {
    throw new RangeError('bucketMinutes must be a positive divisor of 60')
  }

  const points = new Map<
    number,
    {
      data: SensorChartPoint
      sensor1ReadAt?: number
      sensor2ReadAt?: number
    }
  >()

  for (const values of sensorValues) {
    const readAt = new Date(values.timestamp).getTime()
    if (!Number.isFinite(readAt)) {
      throw new Error('Sensor data contains an invalid timestamp')
    }
    const bucket = new Date(readAt)
    bucket.setMinutes(
      Math.floor(bucket.getMinutes() / bucketMinutes) * bucketMinutes,
      0,
      0,
    )
    const bucketTime = bucket.getTime()
    const point = points.get(bucketTime) ?? {
      data: { time: bucketTime },
    }

    if (values.deviceName === 'Sensor_1') {
      if (point.sensor1ReadAt === undefined || readAt > point.sensor1ReadAt) {
        point.data.sensor1Temperature = values.temperature
        point.data.sensor1Humidity = values.humidity
        point.sensor1ReadAt = readAt
      }
    } else if (
      point.sensor2ReadAt === undefined ||
      readAt > point.sensor2ReadAt
    ) {
      point.data.sensor2Temperature = values.temperature
      point.data.sensor2Humidity = values.humidity
      point.sensor2ReadAt = readAt
    }
    points.set(bucketTime, point)
  }

  return [...points.values()]
    .map(({ data }) => data)
    .sort((a, b) => a.time - b.time)
}
