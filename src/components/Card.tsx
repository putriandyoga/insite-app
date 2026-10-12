import type { HTMLAttributes, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const Card = ({ children, className = "", ...props }: CardProps) => (
  <div
    className={`bg-base-100 rounded-xl border border-base-300 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
