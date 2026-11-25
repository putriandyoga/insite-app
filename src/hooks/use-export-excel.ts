import { useState } from "react";
import { utils, writeFile } from "xlsx";

interface UseExportExcelOptions<T> {
  filename?: string;
  sheetName?: string;
  mapper: (item: T, index: number) => Record<string, any>;
}

export function useExportExcel<T>({
  filename = "laporan",
  sheetName = "Sheet1",
  mapper,
}: UseExportExcelOptions<T>) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportExcel = async (items: T[]) => {
    if (!items?.length) return;
    setLoading(true);
    try {
      const sheetData = items.map((item, i) => mapper(item, i));
      const worksheet = utils.json_to_sheet(sheetData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, sheetName);
      writeFile(workbook, `${filename}.xlsx`);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return { exportExcel, loading, progress };
}
