import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/10 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            aria-label="WatchTemp home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17v-6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-[0.18em] text-white">
                WATCHTEMP
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Indoor climate monitor
              </span>
            </span>
          </Link>
          <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 sm:inline-flex">
            Home monitoring, made simple
          </span>
        </header>

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1.5 text-sm text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />A little
              more comfort, at a glance
            </div>
            <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Get to know the air in your{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">
                home.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              WatchTemp brings your room temperature and humidity into one calm,
              easy-to-read view. Check what’s happening now, then explore how
              your readings change over time.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Open your dashboard
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M4.5 10h11m-4.5-4.5L15.5 10 11 14.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <p className="text-sm text-slate-500">
                Live conditions and historical averages
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-300" />
                Temperature
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Humidity
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Room-by-room
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-500/10 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Your home
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    A clearer picture
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  WatchTemp
                </span>
              </div>

              <div className="mt-7 space-y-3">
                {[
                  {
                    name: 'Livingroom',
                    device: 'Sensor 01',
                    accent: 'border-orange-300/20 bg-orange-300/[0.06]',
                    icon: 'text-orange-300',
                    label: 'Temperature & humidity',
                    symbol: '°',
                  },
                  {
                    name: 'Bedroom',
                    device: 'Sensor 02',
                    accent: 'border-cyan-300/20 bg-cyan-300/[0.06]',
                    icon: 'text-cyan-300',
                    label: 'Temperature & humidity',
                    symbol: '•',
                  },
                ].map((room) => (
                  <article
                    key={room.name}
                    className={`flex items-center gap-4 rounded-2xl border p-4 ${room.accent}`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950/70 ${room.icon}`}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                      >
                        {room.name === 'Livingroom' ? (
                          <path
                            d="M4 11.5 12 5l8 6.5V20h-6v-5h-4v5H4v-8.5Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ) : (
                          <path
                            d="M4 18V8m0 7h16M8 12V9a2 2 0 0 1 2-2h2a3 3 0 0 1 3 3v5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="font-medium text-white">{room.name}</h3>
                        <span className="text-xs text-slate-500">
                          {room.device}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {room.label}
                      </p>
                    </div>
                    <span
                      className={`hidden text-2xl font-light sm:block ${room.icon}`}
                      aria-hidden="true"
                    >
                      {room.symbol}
                    </span>
                  </article>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/[0.07] bg-slate-950/70 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                    >
                      <path
                        d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      See the bigger picture
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Review averages over a date range you choose
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5 text-xs text-slate-500">
                <span>Two rooms, one simple view</span>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-cyan-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  Get started
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-5 text-center text-xs text-slate-600">
          WatchTemp · A comfortable home starts with knowing your environment.
        </footer>
      </div>
    </main>
  )
}
