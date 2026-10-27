import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import ActionButton from "./ActionButton";
import { getButtonColorClass, type DaisyColor } from "@/utils/color";

type DropdownItem = {
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  color?: string;
  disabled?: boolean;
};

type ActionDropdownButtonProps = {
  icon: LucideIcon;
  label: string;
  color?: DaisyColor;
  items: DropdownItem[];
  className?: string;
};

const ActionDropdownButton = ({
  icon,
  label,
  color = "primary",
  items,
  className,
}: ActionDropdownButtonProps) => {
  const buttonStyle = getButtonColorClass(color);

  return (
    <div
      className={`relative dropdown dropdown-end ${className || "w-full md:w-auto"}`}
    >
      <ActionButton
        icon={icon}
        label={label}
        color={color}
        className="min-w-34"
      />

      <ul
        className="dropdown-content z-900 mt-2 menu p-2 shadow bg-base-100 rounded-xl
           min-w-56 w-full border border-base-300"
      >
        <li
          className={`${buttonStyle} rounded-lg text-primary-content text-center font-semibold mb-1`}
        >
          {label}
        </li>

        {items.map((item, idx) => {
          const content = (
            <>
              {item.icon && (
                <item.icon
                  className={`w-4 h-4 ${item.color || "text-base-content"}`}
                />
              )}
              <span>{item.label}</span>
            </>
          );
          const itemClasses = `
            flex items-center flex-nowrap gap-2
            px-3 py-2 rounded-lg transition-colors
            hover:bg-base-300 my-1
            whitespace-nowrap
            ${item.color || "text-base-content"}
            ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
          `;

          return (
            <li key={idx} className="border-b border-base-300 last:border-none">
              {item.to ? (
                <Link to={item.to} className={itemClasses}>
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={itemClasses}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ActionDropdownButton;
