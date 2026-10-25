import { createFileRoute, Link } from '@tanstack/react-router'
import { CurrentSensorData } from '#/components/current-sensor-data/CurrentSensorData'
import { CurrentDaySensorChart } from '#/components/current-day-sensor-chart/CurrentDaySensorChart'
import { SensorAverages as SensorAveragesComponent } from '#/components/sensor-averages/SensorAverages'
import * as React from 'react'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isConnected, setIsConnected] = React.useState(false)

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

        <CurrentSensorData onConnectionChange={setIsConnected} />
        <CurrentDaySensorChart />
        <SensorAveragesComponent />
      </div>
    </main>
  )
}
