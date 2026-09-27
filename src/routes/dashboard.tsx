import { createFileRoute, Link } from '@tanstack/react-router'
import { useSocket } from '#/hooks/useSocket'
import { API_URL } from '#/lib/config'
import * as React from 'react'

async function fetchSensorDataAverage(params: URLSearchParams) {
  const response = await fetch(
    `${API_URL}/sensorvalues/Sensor_1/average?${params}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch sensor data history')
  }
  return response.json()
}

const DefaultStartDateAndTime = new Date()
DefaultStartDateAndTime.setHours(0, 0, 0)

const DefaultEndDateAndTime = new Date()
DefaultEndDateAndTime.setHours(23, 59, 59)

const params = new URLSearchParams({
  startDate: DefaultStartDateAndTime.toISOString(),
  endDate: DefaultEndDateAndTime.toISOString(),
})

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  loader: () => fetchSensorDataAverage(params),
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const { isConnected, socket } = useSocket()

  const [liveSensorValues, setLiveSensorValues] = React.useState<any[]>([])

  socket.on('sensor-values', (liveData) => {
    setLiveSensorValues(liveData)
  })

  return (
    <>
      <div>
        WebSocket status:{' '}
        <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <Link to={'/'} className="ml-2 text-blue-500 underline">
        Back to Index
      </Link>
      <div>
        <h2 className="text-2xl font-bold mt-4">Current Sensor Date</h2>
      </div>
      <div className="text-red-500">
        Temperature: {liveSensorValues.temperature}
      </div>
      <div className="text-red-500">Humidity: {liveSensorValues.humidity}</div>
      <div className="text-red-500">Time: {liveSensorValues.timestamp}</div>

      <div>
        <h2 className="text-2xl font-bold mt-4">Average Values for Start: </h2>
      </div>

      <div className="text-blue-500">
        Average Temperature: {data.averageTemperature.toFixed(1)}
      </div>
      <div className="text-blue-500">
        Average Humidity: {data.averageHumidity.toFixed(1)}
      </div>
    </>
  )
}
