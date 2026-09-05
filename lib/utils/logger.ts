type LogLevel = "info" | "warn" | "error" | "debug";

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, context ? JSON.stringify(context) : "");
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, context ? JSON.stringify(context) : "");
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error, context ? JSON.stringify(context) : "");
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, context ? JSON.stringify(context) : "");
    }
  },
};
