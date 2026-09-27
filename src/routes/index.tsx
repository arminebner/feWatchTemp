import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
        <Link to={'/dashboard'} className="ml-2 text-blue-500 underline">
          Go to Dashboard
        </Link>
      </p>
    </div>
  )
}
