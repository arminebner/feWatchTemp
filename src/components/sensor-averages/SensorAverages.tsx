import * as React from 'react'
import { API_URL } from '#/lib/config'
import type {
  SensorAverage,
  SensorAverages as SensorAveragesData,
  SensorName,
} from '#/lib/sensor-types'
import { endOfDay, format, startOfDay } from 'date-fns'
import { formatAverage } from './format-average'

const today = new Date()
const defaultStartDateAndTime = startOfDay(today)
const defaultEndDateAndTime = endOfDay(today)
const dateTimeInputFormat = "yyyy-MM-dd'T'HH:mm"

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

async function fetchAverages(
  startDate: string,
  endDate: string,
): Promise<SensorAveragesData> {
  const params = new URLSearchParams({ startDate, endDate })
  const [sensor1, sensor2] = await Promise.all([
    fetchSensorDataAverage('Sensor_1', params),
    fetchSensorDataAverage('Sensor_2', params),
  ])
  return { sensor1, sensor2 }
}

function SensorAverages() {
  const idPrefix = React.useId()
  const headingId = `${idPrefix}-heading`
  const startDateId = `${idPrefix}-start-date`
  const endDateId = `${idPrefix}-end-date`
  const [averages, setAverages] = React.useState<SensorAveragesData>({
    sensor1: null,
    sensor2: null,
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [startDateTime, setStartDateTime] = React.useState(
    format(defaultStartDateAndTime, dateTimeInputFormat),
  )
  const [endDateTime, setEndDateTime] = React.useState(
    format(defaultEndDateAndTime, dateTimeInputFormat),
  )

  React.useEffect(() => {
    let isMounted = true
    fetchAverages(
      defaultStartDateAndTime.toISOString(),
      defaultEndDateAndTime.toISOString(),
    )
      .then((initialAverages) => {
        if (isMounted) {
          setAverages(initialAverages)
        }
      })
      .catch((fetchError: unknown) => {
        if (isMounted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to fetch sensor averages.',
          )
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const submitDateRange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const startDate = new Date(startDateTime)
    const endDate = new Date(endDateTime)
    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate > endDate
    ) {
      setError('Select a valid date range.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const nextAverages = await fetchAverages(
        startDate.toISOString(),
        endDate.toISOString(),
      )
      setAverages(nextAverages)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Failed to fetch sensor averages.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mt-10" aria-labelledby={headingId}>
      <div className="mb-4">
        <h2 id={headingId} className="text-lg font-semibold">
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
                htmlFor={startDateId}
              >
                Start date and time
              </label>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                type="datetime-local"
                id={startDateId}
                required
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </div>
            <div className="min-w-0">
              <label
                className="mb-2 block text-sm font-medium text-slate-300"
                htmlFor={endDateId}
              >
                End date and time
              </label>
              <input
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                type="datetime-local"
                id={endDateId}
                required
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <p className="mt-4 text-sm text-rose-300" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Results use the selected local date and time.
            </p>
            <button
              className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Loading averages…' : 'Update averages'}
            </button>
          </div>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {(
            [
              ['Livingroom', averages.sensor1],
              ['Bedroom', averages.sensor2],
            ] as const
          ).map(([sensorName, sensorAverages]) => (
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
                    {formatAverage(sensorAverages?.averageTemperature)}
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
                    {formatAverage(sensorAverages?.averageHumidity)}
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
  )
}

export { SensorAverages }
