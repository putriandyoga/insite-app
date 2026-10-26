interface AudioAlertBannerProps {
  tampilkan: boolean;
  onBukaSuara: () => void;
}

export const AudioAlertBanner = ({
  tampilkan,
  onBukaSuara,
}: AudioAlertBannerProps) => {
  if (!tampilkan) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 border border-warning/50 rounded-xl bg-warning/10 text-warning shrink-0 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
        </span>
        <span className="text-body font-medium">
          Browser memblokir suara otomatis sampai Anda mengaktifkannya sekali.
        </span>
      </div>
      <button
        onClick={onBukaSuara}
        className="px-4 py-2 font-semibold bg-warning text-warning-content rounded-lg hover:bg-warning/90 transition-all cursor-pointer border-none shadow-sm active:scale-95"
      >
        Aktifkan Suara
      </button>
    </div>
  );
};
