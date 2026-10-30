import { getColorScheme } from "@/utils/color";
import type { DaisyColor } from "@/utils/color";
import { FileX, type LucideIcon } from "lucide-react";

type IndicatorEmptyProps = {
  message?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  color?: DaisyColor;
};

export function IndicatorEmpty({
  message = "Data Tidak Tersedia",
  description = "Belum ada data yang dapat ditampilkan saat ini.",
  icon: Icon = FileX,
  actionLabel,
  onAction,
  color = "primary",
}: IndicatorEmptyProps) {
  const scheme = getColorScheme(color);
  const SelectedIcon = Icon || FileX;

  return (
    <div
      className={`
        ${scheme.bg}
        ${scheme.border}
        border
        rounded-2xl
        p-8 sm:p-12
        text-center
        flex flex-col items-center gap-4
      `}
    >
      <div
        className={`
          ${scheme.iconBg}
          rounded-full
          p-4 sm:p-5
          animate-pulse
          flex items-center justify-center
        `}
      >
        {/* Ubah className icon agar tidak transparan/senada dengan background */}
        <SelectedIcon size={32} className="text-primary-content" />
      </div>

      <div className="space-y-2">
        <p className="font-bold text-lg sm:text-xl text-base-content">
          {message}
        </p>
        <p className="text-base-content/60 text-body">{description}</p>
      </div>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className={`
            btn btn-sm sm:btn-md
            rounded-full
            ${scheme.buttonBg}
            hover:scale-105
            transition-transform
            mt-2
          `}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
