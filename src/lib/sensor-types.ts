export type SensorName = 'Sensor_1' | 'Sensor_2'

export type SensorValues = {
  temperature: number
  humidity: number
  timestamp: string
  deviceName: SensorName
}

export type SensorAverage = {
  averageTemperature: number | null
  averageHumidity: number | null
} | null

export type SensorAverages = {
  sensor1: SensorAverage
  sensor2: SensorAverage
}
