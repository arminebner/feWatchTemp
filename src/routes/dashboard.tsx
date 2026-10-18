import { createFileRoute, Link } from '@tanstack/react-router'
import { useSocket } from '#/hooks/useSocket'
import { API_URL } from '#/lib/config'
import * as React from 'react'
import { endOfDay, format, startOfDay } from 'date-fns'

type SensorName = 'Sensor_1' | 'Sensor_2'

type SensorValues = {
  temperature: number
  humidity: number
  timestamp: string
  deviceName: SensorName
}

type SensorAverage = {
  averageTemperature: number | null
  averageHumidity: number | null
} | null

function formatAverage(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(1)
    : '--'
}

async function fetchSensorDataAverage(
  sensorName: SensorName,
  params: URLSearchParams,
): Promise<SensorAverage> {
  const response = await fetch(
    `${API_URL}/sensorvalues/${sensorName}/average?${params}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch sensor data history')
  }
  return response.json() as Promise<SensorAverage>
}

const defaultStartDateAndTime = startOfDay(new Date())
const defaultEndDateAndTime = endOfDay(new Date())
const dateTimeInputFormat = "yyyy-MM-dd'T'HH:mm"

const params = new URLSearchParams({
  startDate: defaultStartDateAndTime.toISOString(),
  endDate: defaultEndDateAndTime.toISOString(),
})

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  loader: async () => {
    const [sensor1, sensor2] = await Promise.all([
      fetchSensorDataAverage('Sensor_1', params),
      fetchSensorDataAverage('Sensor_2', params),
    ])
    return { sensor1, sensor2 }
  },
})

function RouteComponent() {
  const initialData = Route.useLoaderData()
  const { isConnected, socket } = useSocket()

  const [data, setData] = React.useState(initialData)
  const [startDateTime, setStartDateTime] = React.useState(
    format(defaultStartDateAndTime, dateTimeInputFormat),
  )
  const [endDateTime, setEndDateTime] = React.useState(
    format(defaultEndDateAndTime, dateTimeInputFormat),
  )
  const [liveSensor1Values, setLiveSensor1Values] =
    React.useState<SensorValues | null>(null)

  const [liveSensor2Values, setLiveSensor2Values] =
    React.useState<SensorValues | null>(null)

  const timestamp1 = liveSensor1Values?.timestamp
    ? new Date(liveSensor1Values.timestamp)
    : null

  const formattedTimestamp1 =
    timestamp1 && !Number.isNaN(timestamp1.getTime())
      ? format(timestamp1, 'PPpp')
      : null

  const timestamp2 = liveSensor2Values?.timestamp
    ? new Date(liveSensor2Values.timestamp)
    : null

  const formattedTimestamp2 =
    timestamp2 && !Number.isNaN(timestamp2.getTime())
      ? format(timestamp2, 'PPpp')
      : null

  const liveSensors = [
    {
      name: 'Livingroom',
      values: liveSensor1Values,
      formattedTimestamp: formattedTimestamp1,
    },
    {
      name: 'Bedroom',
      values: liveSensor2Values,
      formattedTimestamp: formattedTimestamp2,
    },
  ]

  React.useEffect(() => {
    const handleSensorValues = (liveData: SensorValues) => {
      switch (liveData.deviceName) {
        case 'Sensor_1':
          setLiveSensor1Values(liveData)
          break
        case 'Sensor_2':
          setLiveSensor2Values(liveData)
          break
      }
    }
    socket.on('sensor-values', handleSensorValues)

    return () => {
      socket.off('sensor-values', handleSensorValues)
    }
  }, [socket])

  const submitDateRange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const queryParams = new URLSearchParams({
      startDate: new Date(startDateTime).toISOString(),
      endDate: new Date(endDateTime).toISOString(),
    })
    const [sensor1, sensor2] = await Promise.all([
      fetchSensorDataAverage('Sensor_1', queryParams),
      fetchSensorDataAverage('Sensor_2', queryParams),
    ])
    setData({ sensor1, sensor2 })
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              WatchTemp
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Sensor dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Monitor live conditions and review historical averages.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300">
              <span
                className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'bg-rose-400'}`}
              />
              {isConnected ? 'Live connection' : 'Disconnected'}
            </div>
            <Link
              to={'/'}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Back to home
            </Link>
          </div>
        </header>

        <section className="mt-8" aria-labelledby="live-heading">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 id="live-heading" className="text-lg font-semibold">
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
            {liveSensors.map((sensor) => (
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
                      <p className="text-sm font-medium text-slate-400">
                        Humidity
                      </p>
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

        <section className="mt-10" aria-labelledby="averages-heading">
          <div className="mb-4">
            <h2 id="averages-heading" className="text-lg font-semibold">
              Historical averages
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose a date range to calculate average sensor readings.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
            <form
              onSubmit={submitDateRange}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/10 sm:p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    className="mb-2 block text-sm font-medium text-slate-300"
                    htmlFor="startDate"
                  >
                    Start date and time
                  </label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    type="datetime-local"
                    id="startDate"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                  />
                </div>
                <div className="min-w-0">
                  <label
                    className="mb-2 block text-sm font-medium text-slate-300"
                    htmlFor="endDate"
                  >
                    End date and time
                  </label>
                  <input
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    type="datetime-local"
                    id="endDate"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Results use the selected local date and time.
                </p>
                <button
                  className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                  type="submit"
                >
                  Update averages
                </button>
              </div>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {(
                [
                  ['Livingroom', data.sensor1],
                  ['Bedroom', data.sensor2],
                ] as const
              ).map(([sensorName, averages]) => (
                <article
                  key={sensorName}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
                >
                  <h3 className="text-base font-semibold">{sensorName}</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        Average temperature
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-orange-300">
                        {formatAverage(averages?.averageTemperature)}
                        <span className="ml-1 text-base font-medium text-slate-400">
                          °C
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        Average humidity
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-cyan-300">
                        {formatAverage(averages?.averageHumidity)}
                        <span className="ml-1 text-base font-medium text-slate-400">
                          %
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
