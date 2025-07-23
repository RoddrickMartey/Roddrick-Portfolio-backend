// Example combined line:
// 127.0.0.1 - - [20/Jul/2025:12:34:56 +0000] "GET /api/projects HTTP/1.1" 200 123 "http://localhost:5173" "Mozilla/5.0 ..."

const COMBINED_RE =
  /^(\S+) - (\S+) \[([^\]]+)\] "(\S+) ([^"]*?) (\S+)" (\d{3}) (\d+|-) "([^"]*)" "([^"]*)"$/;

/**
 * Parse a single morgan combined log line into an object.
 * Returns null if line doesn't match.
 */
export function parseMorganCombined(line) {
  const m = COMBINED_RE.exec(line);
  if (!m) return null;

  const [
    ,
    remoteAddr,
    remoteUser,
    dateRaw,
    method,
    url,
    httpVersion,
    status,
    length,
    referrer,
    userAgent,
  ] = m;

  return {
    remoteAddr,
    remoteUser: remoteUser === "-" ? null : remoteUser,
    dateRaw, // original string; parse if needed
    method,
    url,
    httpVersion,
    status: Number(status),
    length: length === "-" ? null : Number(length),
    referrer: referrer === "-" ? null : referrer,
    userAgent,
  };
}
