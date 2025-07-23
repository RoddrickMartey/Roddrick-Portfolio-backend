import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";

/**
 * Ensure logs directory exists.
 */
function ensureLogDir(logDir) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

/**
 * Simple daily filename helper (YYYY-MM-DD).
 * Change to static "access.log" if you don't want daily files.
 */
function getLogFilePath(logDir) {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return path.join(logDir, `access-${yyyy}-${mm}-${dd}.log`);
}

/**
 * Attach logging middleware.
 * DEV: morgan('dev') to console.
 * PROD: morgan('combined') to file (no console spam).
 */
export function setupLogging(app, options = {}) {
  const {
    env = process.env.NODE_ENV,
    logDir = path.join(process.cwd(), "logs"),
    daily = true, // toggle if you want 1 file vs daily files
  } = options;

  //   if (env === "development") {
  //     app.use(morgan("dev"));
  //     return;
  //   }

  // production-ish
  ensureLogDir(logDir);
  const logPath = daily
    ? getLogFilePath(logDir)
    : path.join(logDir, "access.log");
  const accessLogStream = fs.createWriteStream(logPath, { flags: "a" });

  // Standard headers help rate-limit + observability tooling (optional)
  app.use(
    morgan("combined", {
      stream: accessLogStream,
    })
  );
}
