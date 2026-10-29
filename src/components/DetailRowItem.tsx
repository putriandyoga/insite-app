import React from "react";

interface DetailRowItemProps {
  label: string;
  children: React.ReactNode;
}

export const DetailRowItem: React.FC<DetailRowItemProps> = ({
  label,
  children,
}) => {
  return (
    <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="text-body text-base-content/60">{label}</div>
      <div className="text-body font-medium text-base-content sm:text-right">
        {children}
      </div>
    </div>
  );
};
