import { getButtonColorClass, type DaisyColor } from "@/utils/color";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type ActionButtonProps = {
  to?: string;
  href?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right" | "start";
  label?: string;
  color?: DaisyColor;
  size?: number;
  tooltip?: string;
  disabledTooltip?: string;
  isProgress?: boolean;
  loading?: boolean;
  progress?: number;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
};

const ActionButton = ({
  to,
  href,
  icon: Icon,
  label,
  color = "primary",
  iconPosition = "left",
  size = 16,
  tooltip,
  disabledTooltip,
  isProgress = false,
  loading = false,
  progress = 0,
  loadingLabel,
  className = "",
  onClick,
  disabled = false,
}: ActionButtonProps) => {
  const buttonStyle = getButtonColorClass(color);

  const baseClasses = [
    "relative overflow-hidden flex items-center justify-center gap-2",
    "px-3 py-2 rounded-lg transition-all duration-300",
    "hover:-translate-y-0.5 min-w-0 shadow-sm hover:shadow-md cursor-pointer",
    buttonStyle,
    color === "neutral" ? "border border-base-300" : "",
    loading || disabled
      ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-sm pointer-events-none"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <span
      className={`relative  flex items-center min-w-0 w-full ${
        iconPosition === "start" ? "justify-start" : "justify-center"
      } gap-2 text-sm font-medium`}
    >
      {loading && isProgress ? (
        loadingLabel ? (
          `${loadingLabel} ${progress}%`
        ) : (
          `Processing... ${progress}%`
        )
      ) : (
        <>
          {Icon && (iconPosition === "left" || iconPosition === "start") && (
            <span className="shrink-0">
              <Icon size={size} />
            </span>
          )}

          {label && (
            <span
              className={`truncate ${
                iconPosition === "start" ? "text-left ps-1" : ""
              }`}
            >
              {label}
            </span>
          )}

          {Icon && iconPosition === "right" && (
            <span className="shrink-0">
              <Icon size={size} />
            </span>
          )}
        </>
      )}
    </span>
  );

  const progressOverlay =
    loading && isProgress ? (
      <>
        <div className="absolute inset-0 bg-base-200/50 z-0" />
        <div
          className="absolute top-0 left-0 h-full bg-primary/30 z-10 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </>
    ) : null;

  const tooltipText = disabled && disabledTooltip ? disabledTooltip : tooltip;

  const tooltipWrapper = (child: React.ReactNode) => (
    <div
      className={tooltipText ? "tooltip tooltip-top" : ""}
      data-tip={tooltipText}
    >
      {child}
    </div>
  );

  // External Link
  if (href && !isProgress) {
    return tooltipWrapper(
      <a
        href={disabled ? undefined : href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
      >
        {content}
      </a>,
    );
  }

  // Internal Router Link
  if (to && !isProgress) {
    return tooltipWrapper(
      <Link
        to={disabled ? "#" : to}
        className={baseClasses}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {content}
      </Link>,
    );
  }

  // Default Interactive Button
  return tooltipWrapper(
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={baseClasses}
    >
      {progressOverlay}
      {content}
    </button>,
  );
};

export default ActionButton;
