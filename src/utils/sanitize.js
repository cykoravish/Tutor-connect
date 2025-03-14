import { escape } from "html-escaper"
import xss from "xss"

export const sanitizeInput = (input) => {
  if (!input) return ""

  // Trim whitespace
  let sanitized = input.trim()

  // Escape HTML entities to prevent XSS
  sanitized = escape(sanitized)

  // Additional XSS protection using the xss library
  sanitized = xss(sanitized)

  // Remove MongoDB operators to prevent NoSQL injection
  sanitized = sanitized.replace(/\$|\{|\}|\[|\]/g, "")

  return sanitized
}

