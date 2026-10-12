import { AlertCircle, RefreshCw } from "lucide-react";

type IndicatorErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function IndicatorError({
  message = "Error saat memuat data",
  onRetry,
}: IndicatorErrorProps) {
  return (
    <div className="bg-error/10 border-2 border-error/30 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-4">
      <div className="bg-error/20 rounded-full p-4 sm:p-5 animate-pulse">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-error" />
      </div>

      <div className="space-y-2">
        <p className="text-error font-bold text-lg sm:text-xl">
          Oops! Terjadi Kesalahan
        </p>
        <p className="text-base-content/70 text-body">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-error btn-sm sm:btn-md rounded-full hover:scale-105 transition-transform flex items-center gap-2 mt-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
}
