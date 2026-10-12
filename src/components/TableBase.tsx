import type { ReactNode } from "react";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
};

type StickyColumn = {
  index: number;
  side?: "left" | "right";
};

type TableBaseProps<T> = {
  columns: Column<T>[];
  data: T[];
  stickyColumns?: StickyColumn[];
  className?: string;
};

export default function TableBase<T>({
  columns,
  data,
  stickyColumns = [],
  className = "",
}: TableBaseProps<T>) {
  return (
    <table className={`table border-collapse w-full min-w-max ${className}`}>
      <thead className="bg-primary shadow">
        <tr>
          {columns.map((col, colIndex) => {
            const sticky = stickyColumns.find((c) => c.index === colIndex);
            const style: React.CSSProperties = {
              ...(sticky?.side === "left" && { left: 0 }),
              ...(sticky?.side === "right" && { right: 0 }),
            };

            return (
              <th
                key={colIndex}
                className={`border border-base-300 px-4 py-3 whitespace-nowrap text-primary-content text-center text-sm font-semibold uppercase tracking-wider ${
                  sticky ? "bg-primary" : ""
                }`}
                style={style}
              >
                {col.header}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="hover:bg-base-100 transition-colors border-t border-base-300"
          >
            {columns.map((col, colIndex) => {
              const sticky = stickyColumns.find((c) => c.index === colIndex);
              const style: React.CSSProperties = {
                ...(sticky?.side === "left" && { left: 0 }),
                ...(sticky?.side === "right" && { right: 0 }),
              };

              return (
                <td
                  key={colIndex}
                  className={`border border-base-300 px-4 py-2 ${
                    col.className ?? ""
                  } ${sticky ? "sticky bg-base-100 z-20" : ""}`}
                  style={style}
                >
                  {col.render
                    ? col.render(row, rowIndex)
                    : col.accessor
                      ? (row[col.accessor] as ReactNode)
                      : null}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
