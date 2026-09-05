import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Telemetry Error",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-red-50/40 rounded-2xl border border-red-200 max-w-md mx-auto my-6 space-y-4">
      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-red-900">{title}</h4>
        <p className="text-xs sm:text-sm text-red-700 max-w-xs">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Operation
        </button>
      )}
    </div>
  );
}
