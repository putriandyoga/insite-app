export const instancesStatusMap: Record<
  string,
  { color: string; label: string }
> = {
  IN_PROGRESS: {
    color: "bg-primary/20 border border-primary/30 text-base-content/80",
    label: "Dalam Proses",
  },
  COMPLETED: {
    color: "bg-success/20 border border-success/30 text-base-content/80",
    label: "Selesai",
  },
  CURRENT: {
    color: "bg-primary/20 border border-primary/30 text-base-content/80",
    label: "Sedang Berjalan",
  },
  CANCELLED: {
    color: "bg-error/20 border border-error/30 text-base-content/80",
    label: "Dibatalkan",
  },
  PENDING: {
    color: "bg-warning/20 border border-warning/30 text-base-content/80",
    label: "Tertunda",
  },
};

// Fungsi helper untuk mengambil status instances dengan aman + nilai default
export const getInstanceStatusInfo = (status?: string) => {
  // Ubah ke uppercase agar "completed", "Completed", atau "COMPLETED" terbaca sama
  const key = (status || "").toUpperCase();

  return (
    instancesStatusMap[key] || {
      color: "bg-ghost border border-base-300 text-base-content/80",
      label: status || "Unknown",
    }
  );
};
