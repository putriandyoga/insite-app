import { useExportExcel } from "@/hooks/use-export-excel";
import type { CallItem } from "@iptv/types/callTypes";

export function useExportCallExcel() {
  const { exportExcel, loading, progress } = useExportExcel<CallItem>({
    filename: "laporan-call",
    sheetName: "Daftar Call",
    mapper: (item, index) => ({
      No: index + 1,
      Ward: item.ward_name || "-",
      "Jenis Call": item.kind || "-",
      "Jumlah Tekan": `${item.press_count || 1}x`,
      "Ditangani Oleh": item.acked_by || "-",
      Status: item.status || "-",
      "Tanggal Dibuat": item.created_at
        ? new Date(item.created_at).toLocaleString()
        : "-",
      "Terakhir Tekan": item.last_pressed_at
        ? new Date(item.last_pressed_at).toLocaleString()
        : "-",
      "Waktu Direspon": item.acked_at
        ? new Date(item.acked_at).toLocaleString()
        : "-",
      "Waktu Selesai": item.resolved_at
        ? new Date(item.resolved_at).toLocaleString()
        : "-",
    }),
  });

  return { exportCallExcel: exportExcel, loading, progress };
}
