type IndicatorFetchingProps = {
  isFetching: boolean;
  text?: string;
};

export default function IndicatorFetching({
  isFetching,
  text = "Memperbarui data...",
}: IndicatorFetchingProps) {
  if (!isFetching) return null;

  return (
    <div className="flex items-center gap-2 text-primary text-xs sm:text-sm animate-pulse whitespace-nowrap">
      <span className="loading loading-spinner loading-xs"></span>
      <span className="hidden sm:inline">{text}</span>
    </div>
  );
}
