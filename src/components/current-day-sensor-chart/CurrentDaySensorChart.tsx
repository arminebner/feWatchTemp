import * as React from 'react'
import { API_URL } from '#/lib/config'
import type { SensorValues } from '#/lib/sensor-types'
import { endOfDay, startOfDay } from 'date-fns'
import { toChartPoints } from './chart-data'
import type { SensorChartPoint } from './chart-data'
import { SensorReadingsChart } from './SensorReadingsChart'

type ChartData = {
  overview: SensorChartPoint[]
  detail: SensorChartPoint[]
}

async function fetchCurrentSensorValues(
  startDate: Date,
  endDate: Date,
  signal?: AbortSignal,
): Promise<SensorValues[]> {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  })
  const response = await fetch(
    `${API_URL}/sensorvalues/current-date?${params}`,
    { signal },
  )
  if (!response.ok) {
    throw new Error('Failed to fetch sensor data for current date')
  }
  return response.json() as Promise<SensorValues[]>
}

function CurrentDaySensorChart() {
  const headingId = React.useId()
  const [dayRange] = React.useState(() => {
    const now = new Date()
    return { start: startOfDay(now), end: endOfDay(now) }
  })
  const [data, setData] = React.useState<ChartData>({
    overview: [],
    detail: [],
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const controller = new AbortController()

    fetchCurrentSensorValues(dayRange.start, dayRange.end, controller.signal)
      .then((sensorValues) => {
        setData({
          overview: toChartPoints(sensorValues, 10),
          detail: toChartPoints(sensorValues, 1),
        })
      })
      .catch((fetchError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Failed to fetch current-day sensor data.',
          )
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [dayRange])

  return (
    <section className="mt-10 space-y-5" aria-labelledby={headingId}>
      <div>
        <h2 id={headingId} className="text-lg font-semibold">
          Today&apos;s sensor readings
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Compare the full day at a glance or explore the readings in more
          detail.
        </p>
      </div>

      {error ? (
        <p
          className="rounded-2xl border border-rose-400/20 bg-rose-400/5 py-12 text-center text-sm text-rose-300"
          role="alert"
        >
          {error}
        </p>
      ) : isLoading ? (
        <p
          className="rounded-2xl border border-white/10 bg-slate-900/60 py-12 text-center text-sm text-slate-400"
          role="status"
        >
          Loading today&apos;s readings…
        </p>
      ) : data.overview.length === 0 && data.detail.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-slate-900/60 py-12 text-center text-sm text-slate-400">
          No sensor readings have been recorded today.
        </p>
      ) : (
        <>
          <SensorReadingsChart
            data={data.overview}
            dayStart={dayRange.start.getTime()}
            dayEnd={dayRange.end.getTime()}
            tickIntervalMinutes={120}
            mobileTickIntervalMinutes={180}
            title="Day overview"
            description="One reading per 10-minute interval with two-hour time labels."
          />
          <SensorReadingsChart
            data={data.detail}
            dayStart={dayRange.start.getTime()}
            dayEnd={dayRange.end.getTime()}
            tickIntervalMinutes={15}
            title="Detailed view"
            description="One reading per minute. Scroll horizontally to inspect the day in more detail."
            scrollable
          />
        </>
      )}
    </section>
  )
}

export { CurrentDaySensorChart }
