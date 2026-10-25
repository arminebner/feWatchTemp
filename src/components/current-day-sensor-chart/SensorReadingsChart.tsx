import * as React from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatTime, getExpandedDomain, getTimeScale } from './chart-scales'
import type { SensorChartPoint } from './chart-data'

type SensorReadingsChartProps = {
  data: SensorChartPoint[]
  dayStart: number
  dayEnd: number
  tickIntervalMinutes: number
  mobileTickIntervalMinutes?: number
  title: string
  description: string
  scrollable?: boolean
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)

    updateIsMobile()
    mediaQuery.addEventListener('change', updateIsMobile)
    return () => mediaQuery.removeEventListener('change', updateIsMobile)
  }, [])

  return isMobile
}

type SensorYAxisRailProps = {
  orientation: 'left' | 'right'
  domain: [number, number]
  color: string
  width: number
  tickFormatter: (value: number) => string
}

function SensorYAxisRail({
  orientation,
  domain,
  color,
  width,
  tickFormatter,
}: SensorYAxisRailProps) {
  const plotTop = 8
  const plotBottom = 38
  const plotHeight = 320 - plotTop - plotBottom
  const ticks = Array.from(
    { length: 6 },
    (_, index) => domain[1] - ((domain[1] - domain[0]) * index) / 5,
  )

  return (
    <div
      className="relative h-80 shrink-0 text-xs"
      style={{ width }}
      role="group"
      aria-label={`${orientation === 'left' ? 'Temperature' : 'Humidity'} scale`}
    >
      <span
        className={`absolute top-2 bottom-[38px] border-l`}
        style={{
          [orientation === 'left' ? 'right' : 'left']: 0,
          borderColor: color,
        }}
        aria-hidden="true"
      />
      {ticks.map((value, index) => {
        const top = plotTop + (plotHeight * index) / (ticks.length - 1)
        return (
          <span
            key={value}
            className={`absolute -translate-y-1/2 whitespace-nowrap text-slate-200 ${
              orientation === 'left' ? 'right-2 text-right' : 'left-2 text-left'
            }`}
            style={{ top, color }}
          >
            {tickFormatter(value)}
          </span>
        )
      })}
    </div>
  )
}

function SensorReadingsChart({
  data,
  dayStart,
  dayEnd,
  tickIntervalMinutes,
  mobileTickIntervalMinutes,
  title,
  description,
  scrollable = false,
}: SensorReadingsChartProps) {
  const isMobile = useIsMobile()
  const headingId = `${title.toLowerCase().replaceAll(' ', '-')}-heading`
  const temperatureDomain = getExpandedDomain(
    data.flatMap((point) => [
      point.sensor1Temperature,
      point.sensor2Temperature,
    ]),
    0.5,
  )
  const humidityDomain = getExpandedDomain(
    data.flatMap((point) => [point.sensor1Humidity, point.sensor2Humidity]),
    1,
  )
  const timeScale = getTimeScale(
    dayStart,
    dayEnd,
    isMobile && mobileTickIntervalMinutes
      ? mobileTickIntervalMinutes
      : tickIntervalMinutes,
  )
  const chartWidth = Math.max(1600, timeScale.ticks.length * 72)

  const chart = (
    <div
      className="h-80 w-full"
      style={scrollable ? { minWidth: `${chartWidth}px` } : undefined}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
        >
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={timeScale.domain}
            ticks={timeScale.ticks}
            interval={0}
            height={30}
            tickFormatter={formatTime}
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            minTickGap={0}
          />
          <YAxis
            yAxisId="temperature"
            stroke="#fb923c"
            domain={temperatureDomain}
            tickFormatter={(value: number) => `${value.toFixed(1)}°`}
            tick={{ fontSize: 12, fill: '#fb923c' }}
            width={68}
            hide={scrollable}
          />
          <YAxis
            yAxisId="humidity"
            orientation="right"
            stroke="#22d3ee"
            domain={humidityDomain}
            tickFormatter={(value: number) => `${value.toFixed(1)}%`}
            tick={{ fontSize: 12, fill: '#22d3ee' }}
            width={76}
            hide={scrollable}
          />
          <Tooltip
            labelFormatter={(label) => formatTime(Number(label))}
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0.75rem',
              color: '#e2e8f0',
            }}
          />
          <Line
            yAxisId="temperature"
            type="monotone"
            dataKey="sensor1Temperature"
            name="Livingroom temperature"
            stroke="#fb923c"
            connectNulls
            dot={false}
          />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="sensor1Humidity"
            name="Livingroom humidity"
            stroke="#22d3ee"
            connectNulls
            dot={false}
          />
          <Line
            yAxisId="temperature"
            type="monotone"
            dataKey="sensor2Temperature"
            name="Bedroom temperature"
            stroke="#f472b6"
            connectNulls
            dot={false}
          />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="sensor2Humidity"
            name="Bedroom humidity"
            stroke="#818cf8"
            connectNulls
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <article
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6"
      aria-labelledby={headingId}
    >
      <div className="mb-5">
        <h3 id={headingId} className="text-base font-semibold">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div
        className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400"
        role="group"
        aria-label="Chart legend"
      >
        {[
          ['Livingroom temperature', '#fb923c'],
          ['Livingroom humidity', '#22d3ee'],
          ['Bedroom temperature', '#f472b6'],
          ['Bedroom humidity', '#818cf8'],
        ].map(([label, color]) => (
          <span key={label} className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </div>
      {scrollable ? (
        <div className="flex h-80 w-full min-w-0">
          <SensorYAxisRail
            orientation="left"
            domain={temperatureDomain}
            color="#fb923c"
            width={68}
            tickFormatter={(value) => `${value.toFixed(1)}°`}
          />
          <div
            className="min-w-0 flex-1 overflow-x-auto"
            role="region"
            aria-label={`${title} sensor readings chart`}
            tabIndex={0}
          >
            <div className="h-80" style={{ width: `${chartWidth}px` }}>
              {chart}
            </div>
          </div>
          <SensorYAxisRail
            orientation="right"
            domain={humidityDomain}
            color="#22d3ee"
            width={76}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
        </div>
      ) : (
        chart
      )}
    </article>
  )
}

export { SensorReadingsChart }
