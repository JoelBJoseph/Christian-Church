export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export function requiredText(value: string | undefined, max: number, label: string) {
  const trimmed = value?.trim() ?? ""
  if (!trimmed) throw new ValidationError(`${label} is required.`)
  if (trimmed.length > max) {
    throw new ValidationError(`${label} must be ${max} characters or fewer.`)
  }
  return trimmed
}

export function optionalText(value: string | undefined, max: number, label: string) {
  const trimmed = value?.trim() ?? ""
  if (!trimmed) return null
  if (trimmed.length > max) {
    throw new ValidationError(`${label} must be ${max} characters or fewer.`)
  }
  return trimmed
}

export function optionalEmail(value: string | undefined) {
  const trimmed = value?.trim() ?? ""
  if (!trimmed) return null
  if (trimmed.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new ValidationError("Enter a valid email address.")
  }
  return trimmed
}

export function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
  } catch {
    return false
  }
}

export function cleanMediaUrl(value: string | undefined, required = false) {
  const trimmed = value?.trim() ?? ""
  if (!trimmed) {
    if (required) throw new ValidationError("A URL is required.")
    return null
  }
  if (trimmed.length > 2000) throw new ValidationError("That URL is too long.")

  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("\\") && !trimmed.includes("..")) {
    return trimmed
  }

  if (!isHttpUrl(trimmed)) {
    throw new ValidationError("Enter a valid image or video URL.")
  }

  return new URL(trimmed).toString()
}
