import xss from "xss";

/**
 * Sanitize any data by removing malicious HTML/JS (XSS).
 * Works with strings, arrays, and objects (recursively).
 *
 * @param {any} input - The data to sanitize.
 * @returns {any} - Sanitized data.
 */
export function sanitize(input) {
  if (typeof input === "string") {
    return xss(input);
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitize(item));
  }

  if (typeof input === "object" && input !== null) {
    const sanitizedObj = {};
    for (const key in input) {
      sanitizedObj[key] = sanitize(input[key]);
    }
    return sanitizedObj;
  }

  return input;
}
