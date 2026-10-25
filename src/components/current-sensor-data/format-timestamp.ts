import { format } from 'date-fns'

export function formatTimestamp(timestamp: string | undefined) {
  if (!timestamp) {
    return null
  }

  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? null : format(date, 'PPpp')
}
