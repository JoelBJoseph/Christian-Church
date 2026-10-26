export function startOfLocalDay(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim())
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2]) - 1
    const day = Number(match[3])
    const date = new Date(year, month, day)
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return null
    }
    return date
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  parsed.setHours(0, 0, 0, 0)
  return parsed
}

export function isPastEventDate(value: string, now = new Date()) {
  const eventDay = startOfLocalDay(value)
  if (!eventDay) return false
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  return eventDay < today
}

export function formatEventDate(value: string, options: Intl.DateTimeFormatOptions) {
  const date = startOfLocalDay(value)
  if (!date) return value
  return date.toLocaleDateString("en-US", options)
}
