import type { ReactNode } from "react";

export function PageTop({ children }: { children: ReactNode }) {
  return <div className="shrink-0 w-full z-20">{children}</div>;
}

export function PageMiddle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function PageBottom({ children }: { children: ReactNode }) {
  return <div className="shrink-0 pt-1">{children}</div>;
}
