export interface IndicatorLoadingProps {
  text?: string;
  fullscreen?: boolean;
}

export function IndicatorLoading({
  text = "Memuat Data...",
  fullscreen = false,
}: IndicatorLoadingProps) {
  const containerStyle = fullscreen
    ? "fixed inset-0 z-50 bg-base-100/80 backdrop-blur-sm"
    : "w-full h-full min-h-[300px] py-20 bg-base-100/40";

  return (
    <div
      className={`flex flex-col items-center justify-center transition-all duration-300 ${containerStyle}`}
    >
      {/* Wrapper Spinner dengan Efek Lembut */}
      <div className="relative flex items-center justify-center mb-3">
        {/* Lingkaran luar berdenyut halus */}
        <div className="absolute w-12 h-12 rounded-full border-2 border-primary/20 animate-ping"></div>
        {/* Spinner utama DaisyUI */}
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>

      {/* Teks Keterangan */}
      <span className="text-sm font-medium tracking-wide text-base-content/70 animate-pulse">
        {text}
      </span>
    </div>
  );
}
