import type { DaisyColor } from "@/utils/color";
import type { LucideIcon } from "lucide-react";
import { IndicatorEmpty } from "./IndicatorEmptyData";
import { IndicatorError } from "./IndicatorError";
import { IndicatorLoading } from "./IndicatorLoading";

interface DataSectionProps<T> {
  loading: boolean;
  error: boolean;
  data: T | T[] | null;

  EmptyComponent?: React.ComponentType<{ message?: string }>;
  ErrorComponent?: React.ComponentType<{
    message?: string;
    onRetry?: () => void;
  }>;
  LoadingComponent?: React.ComponentType;
  emptyMessage?: string;

  errorMessage?: string;
  onRetry?: () => void;

  color?: DaisyColor;
  description?: string;
  icon?: LucideIcon;
}

export default function DataSection<T>({
  loading,
  error,
  data,
  EmptyComponent,
  ErrorComponent,
  LoadingComponent,
  emptyMessage = "Data belum tersedia.",
  errorMessage = "Terjadi kesalahan saat memuat data",
  onRetry,
  color = "primary",
  description,
  icon,
}: DataSectionProps<T>) {
  if (loading) {
    const Component = LoadingComponent || IndicatorLoading;
    return <Component />;
  }

  if (error) {
    const Component = ErrorComponent || IndicatorError;
    return <Component message={errorMessage} onRetry={onRetry} />;
  }

  const isEmpty = data === null || (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    const Component = EmptyComponent;
    if (Component) return <Component message={emptyMessage} />;
    return (
      <IndicatorEmpty
        message={emptyMessage}
        description={description}
        icon={icon}
        color={color}
      />
    );
  }

  return null;
}
