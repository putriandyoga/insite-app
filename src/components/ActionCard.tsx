import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { getIconBgClass } from "@/utils/color";
type ActionCardProps = {
  color?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  path?: string;
  onClick?: () => void;
};

const isDaisyColor = (color: string): boolean => {
  return [
    "primary",
    "secondary",
    "accent",
    "info",
    "success",
    "warning",
    "error",
    "neutral",
  ].includes(color);
};

const ActionCard = ({
  color = "primary",
  icon: Icon,
  title,
  description,
  path,
  onClick,
}: ActionCardProps) => {
  const iconBg = isDaisyColor(color) ? getIconBgClass(color as any) : color;

  const isLink = Boolean(path);
  const Wrapper: React.ElementType = isLink ? Link : "button";

  return (
    <Wrapper
      {...(isLink ? { to: path } : { onClick })}
      className="
        group relative
        bg-base-100 rounded-2xl p-6
        shadow-sm hover:shadow-xl
        transition-all duration-300
        border border-base-300
        hover:-translate-y-1
        flex flex-col
      "
    >
      <div
        className={`
          w-16 h-16 rounded-2xl mb-4
          ${iconBg}
          flex items-center justify-center
          shadow-lg
          transition-transform duration-300
          group-hover:scale-110 group-hover:rotate-3
        `}
      >
        <Icon className="w-8 h-8 text-base-100" strokeWidth={2} />
      </div>

      <h3 className="text-lg font-semibold text-base-content mb-1 text-left">
        {title}
      </h3>

      <p className="text-sm text-base-content mb-4 text-left">{description}</p>

      <div
        className="
          absolute bottom-6 right-6
          transition-all duration-300
          opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
        "
      >
        <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-base-content text-lg">→</span>
        </div>
      </div>
    </Wrapper>
  );
};

export default ActionCard;
