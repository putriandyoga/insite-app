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
    if (!items || items.length === 0) return;

    setLoading(true);
    setProgress(0);

    const sheetData: Record<string, any>[] = [];

    for (let i = 0; i < items.length; i++) {
      // Petakan tiap item menggunakan mapper function dari spesifik hook
      sheetData.push(mapper(items[i], i));

      // Simulasi jeda progress bar (bisa dihapus jika datanya besar & ingin proses instan)
      await new Promise((resolve) => setTimeout(resolve, 50));

      const percent = Math.round(((i + 1) / items.length) * 100);
      setProgress(percent);
    }

    const worksheet = utils.json_to_sheet(sheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, sheetName);

    writeFile(workbook, `${filename}.xlsx`);

    setLoading(false);
    setProgress(0);
  };

  return { exportExcel, loading, progress };
}
