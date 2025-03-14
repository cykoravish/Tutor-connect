import xss from "xss"

/**
 * Custom middleware to sanitize request body, query parameters, and URL parameters
 * to prevent XSS attacks
 */
export const xssFilter = (req, res, next) => {
  // Function to recursively sanitize objects
  const sanitizeObj = (obj) => {
    if (!obj) return obj

    if (typeof obj === "string") {
      return xss(obj)
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeObj(item))
    }

    if (typeof obj === "object") {
      const result = {}
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = sanitizeObj(obj[key])
        }
      }
      return result
    }

    return obj
  }

  // Sanitize req.body
  if (req.body) {
    req.body = sanitizeObj(req.body)
  }

  // Sanitize req.query
  if (req.query) {
    req.query = sanitizeObj(req.query)
  }

  // Sanitize req.params
  if (req.params) {
    req.params = sanitizeObj(req.params)
  }

  next()
}

