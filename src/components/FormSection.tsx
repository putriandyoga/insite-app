import { type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { type DaisyColor, getButtonColorClass } from "@/utils/color";

type FormSectionProps = {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  color?: DaisyColor;
  stickyHeader?: boolean;
};

const FormSection = ({
  title,
  icon: Icon,
  children,
  className = "",
  color = "primary",
  stickyHeader = false,
}: FormSectionProps) => {
  const cardBg = getButtonColorClass(color);

  return (
    <div
      className={`bg-base-100 rounded-xl border border-base-300 overflow-visible ${className}`}
    >
      <div
        className={[
          "px-6 py-4 rounded-t-xl border-b border-base-300 flex items-center gap-2",
          cardBg,
          stickyHeader && "sticky top-0 z-20",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {Icon && <Icon className="w-5 h-5 text-base-content" />}
        <h2 className="text-base font-semibold text-base-content">{title}</h2>
      </div>

      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
};

export default FormSection;
