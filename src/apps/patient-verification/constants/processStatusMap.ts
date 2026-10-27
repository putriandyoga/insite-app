import { capitalizeEachWord } from "@/utils/capitalizer";

export const processStatusMap: Record<
  string,
  { color: string; label: string }
> = {
  PUBLISHED: {
    color: "bg-primary/20 text-primary border border-primary/30",
    label: "Published",
  },
  DRAFT: {
    color: "bg-neutral/20 text-base-content border border-neutral/30",
    label: "Draft",
  },
  ARCHIVED: {
    color: "bg-warning/20 text-warning border border-warning/30",
    label: "Archived",
  },
};

// Fungsi helper untuk mengambil status dengan aman + nilai default
export const getProcessStatusInfo = (status?: string) => {
  const key = (status || "").toUpperCase();
  return (
    processStatusMap[key] || {
      color: "bg-ghost text-base-content border border-base-300",
      label: capitalizeEachWord(status || "Unknown"),
    }
  );
};
