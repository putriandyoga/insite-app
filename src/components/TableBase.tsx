import type { CSSProperties, ReactNode } from "react";

type Column<T> = {
  header: ReactNode;
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
  const getStickyStyle = (colIndex: number): CSSProperties => {
    const sticky = stickyColumns.find((column) => column.index === colIndex);

    return {
      ...(sticky?.side === "left" && { left: 0 }),
      ...(sticky?.side === "right" && { right: 0 }),
    };
  };

  return (
    <div className="relative max-h-full w-full overflow-auto">
      <table className={`table w-full border-collapse ${className}`}>
        <thead>
          <tr>
            {columns.map((col, colIndex) => {
              const sticky = stickyColumns.find(
                (column) => column.index === colIndex,
              );

              return (
                <th
                  key={colIndex}
                  className={`
                    sticky top-0 z-30
                    border border-base-300
                    bg-primary px-4 py-3
                    text-center text-sm font-semibold
                    uppercase tracking-wider
                    text-primary-content
                    whitespace-nowrap
                    ${sticky ? "z-40" : ""}
                    ${col.className ?? ""}
                  `}
                  style={getStickyStyle(colIndex)}
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
              className="border-t border-base-300 transition-colors hover:bg-base-100"
            >
              {columns.map((col, colIndex) => {
                const sticky = stickyColumns.find(
                  (column) => column.index === colIndex,
                );

                return (
                  <td
                    key={colIndex}
                    className={`
                      border border-base-300 px-4 py-2
                      ${col.className ?? ""}
                      ${sticky ? "sticky z-20 bg-base-100" : ""}
                    `}
                    style={getStickyStyle(colIndex)}
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
    </div>
  );
}
