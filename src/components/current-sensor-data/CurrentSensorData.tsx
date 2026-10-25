import * as React from 'react'
import { useSocket } from '#/hooks/useSocket'
import type { SensorName, SensorValues } from '#/lib/sensor-types'
import { formatTimestamp } from './format-timestamp'

type LiveSensor = {
  name: string
  values: SensorValues | null
  formattedTimestamp: string | null
}

type CurrentSensorDataProps = {
  onConnectionChange: (isConnected: boolean) => void
}

function CurrentSensorData({ onConnectionChange }: CurrentSensorDataProps) {
  const headingId = React.useId()
  const { isConnected, socket } = useSocket()
  const [sensorValues, setSensorValues] = React.useState<
    Record<SensorName, SensorValues | null>
  >({ Sensor_1: null, Sensor_2: null })

  React.useEffect(() => {
    onConnectionChange(isConnected)
  }, [isConnected, onConnectionChange])

  React.useEffect(() => {
    const handleSensorValues = (liveData: SensorValues) => {
      setSensorValues((current) => ({
        ...current,
        [liveData.deviceName]: liveData,
      }))
    }

    socket.on('sensor-values', handleSensorValues)
    return () => {
      socket.off('sensor-values', handleSensorValues)
    }
  }, [socket])

  const sensors: LiveSensor[] = [
    {
      name: 'Livingroom',
      values: sensorValues.Sensor_1,
      formattedTimestamp: formatTimestamp(sensorValues.Sensor_1?.timestamp),
    },
    {
      name: 'Bedroom',
      values: sensorValues.Sensor_2,
      formattedTimestamp: formatTimestamp(sensorValues.Sensor_2?.timestamp),
    },
  ]

  return (
    <section className="mt-8" aria-labelledby={headingId}>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 id={headingId} className="text-lg font-semibold">
            Live conditions
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Latest readings from both sensors
          </p>
        </div>
        <span className="hidden text-xs text-slate-500 sm:block">
          Updates in real time
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sensors.map((sensor) => (
          <div
            key={sensor.name}
            className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"
          >
            <h3 className="mb-4 text-base font-semibold">{sensor.name}</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">
                    Temperature
                  </p>
                  <span className="rounded-lg bg-orange-400/10 px-2.5 py-1 text-xs font-medium text-orange-300">
                    LIVE
                  </span>
                </div>
                <p className="mt-5 text-4xl font-semibold tracking-tight">
                  {sensor.values?.temperature ?? '--'}
                  <span className="ml-1 text-xl font-medium text-slate-400">
                    °C
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Current sensor reading
                </p>
              </article>
              <article className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-400">Humidity</p>
                  <span className="rounded-lg bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                    LIVE
                  </span>
                </div>
                <p className="mt-5 text-4xl font-semibold tracking-tight">
                  {sensor.values?.humidity ?? '--'}
                  <span className="ml-1 text-xl font-medium text-slate-400">
                    %
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Current sensor reading
                </p>
              </article>
              <article className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/60 p-5 sm:col-span-2 xl:col-span-1">
                <p className="text-sm font-medium text-slate-400">
                  Last updated
                </p>
                <p className="mt-5 break-words text-lg font-semibold">
                  {sensor.formattedTimestamp ?? 'Waiting for first reading'}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Timestamp from {sensor.name}
                </p>
              </article>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { CurrentSensorData }
