export type DaisyColor =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "base-300"
  | "neutral";

export type ColorScheme = DaisyColor;

export type ColorSchemeConfig = {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  buttonBg: string;
};

// Peta utama konfigurasi warna
export const colorSchemeMap: Record<DaisyColor, ColorSchemeConfig> = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/50",
    iconBg: "bg-primary",
    iconColor: "text-primary",
    buttonBg: "bg-primary/80 hover:bg-primary",
  },
  secondary: {
    bg: "bg-gradient-to-br from-secondary/10 via-secondary/25 to-secondary/40",
    border: "border-secondary/50",
    iconBg: "bg-secondary",
    iconColor: "text-secondary",
    buttonBg: "bg-secondary/80 hover:bg-secondary",
  },
  accent: {
    bg: "bg-gradient-to-br from-accent/10 via-accent/25 to-accent/40",
    border: "border-accent/50",
    iconBg: "bg-accent",
    iconColor: "text-accent",
    buttonBg: "bg-accent/80 hover:bg-accent",
  },
  info: {
    bg: "bg-gradient-to-br from-info/10 via-info/25 to-info/40",
    border: "border-info/50",
    iconBg: "bg-info",
    iconColor: "text-info",
    buttonBg: "bg-info/80 hover:bg-info",
  },
  success: {
    bg: "bg-gradient-to-br from-success/10 via-success/25 to-success/40",
    border: "border-success/50",
    iconBg: "bg-success",
    iconColor: "text-success",
    buttonBg: "bg-success/80 hover:bg-success",
  },
  warning: {
    bg: "bg-gradient-to-br from-warning/10 via-warning/25 to-warning/40",
    border: "border-warning/50",
    iconBg: "bg-warning",
    iconColor: "text-warning",
    buttonBg: "bg-warning/80 hover:bg-warning",
  },
  error: {
    bg: "bg-gradient-to-br from-error/10 via-error/25 to-error/40",
    border: "border-error/50",
    iconBg: "bg-error",
    iconColor: "text-error",
    buttonBg: "bg-error/80 hover:bg-error",
  },
  neutral: {
    bg: "bg-gradient-to-br from-neutral/5 via-neutral/15 to-neutral/25",
    border: "border-base-300",
    iconBg: "bg-neutral",
    iconColor: "text-neutral",
    buttonBg: "bg-neutral/80 hover:bg-neutral",
  },
  "base-300": {
    bg: "bg-base-300",
    border: "border-base-300",
    iconBg: "bg-base-300",
    iconColor: "text-base-content",
    buttonBg: "bg-base-300 hover:bg-base-200",
  },
};

// --- HELPER FUNCTIONS ---
// Mengambil konfigurasi dasar berdasarkan warna
export const getColorScheme = (color: DaisyColor): ColorSchemeConfig =>
  colorSchemeMap[color] || colorSchemeMap.primary;

// Helper untuk mengambil class spesifik secara aman
export const getBgClass = (color: DaisyColor): string =>
  getColorScheme(color).bg;
export const getBorderClass = (color: DaisyColor): string =>
  getColorScheme(color).border;
export const getIconBgClass = (color: DaisyColor): string =>
  getColorScheme(color).iconBg;
export const getIconColorClass = (color: ColorScheme): string =>
  getColorScheme(color).iconColor;
export const getButtonColorClass = (color: ColorScheme): string =>
  getColorScheme(color).buttonBg;

// Alias untuk kompatibilitas fungsi lama jika terlanjur dipakai di komponen lain
export const getCardBaseBgClass = (color: DaisyColor): string =>
  `bg-base-100 hover:bg-${color}/30`;
export const getHeaderGradientClass = (color: ColorScheme): string =>
  getBgClass(color);
export const getGradientClass = (color: ColorScheme): string =>
  getBgClass(color);
