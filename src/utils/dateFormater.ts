// --- Konstanta Lokal ---
const INDONESIAN_MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

const INDONESIAN_MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

const INDONESIAN_DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

type DateInput = string | Date | null | undefined;

/** Helper internal untuk parsing tanggal */
const parseDate = (date: DateInput): Date | null => {
  if (!date) return null;
  const dt = typeof date === "string" ? new Date(date) : date;
  return isNaN(dt.getTime()) ? null : dt;
};

// --- Fungsi Format Tanggal & Waktu ---

export function getAgeFromDob(dob: DateInput): string {
  const birthDate = parseDate(dob);
  if (!birthDate) return "";

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} tahun ${months} bulan ${days} hari`;
}

export function getAgeYearsOnly(dob: DateInput): string {
  const birthDate = parseDate(dob);
  if (!birthDate) return "";

  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) years--;

  return `${years} tahun`;
}

export function formatDateIndo(date: DateInput, shortMonth = false): string {
  const dt = parseDate(date);
  if (!dt) return "";

  const months = shortMonth ? INDONESIAN_MONTHS_SHORT : INDONESIAN_MONTHS_FULL;
  return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

export function formatDateIndoWithTime(date: DateInput): string {
  const dt = parseDate(date);
  if (!dt) return "";

  const hours = dt.getHours().toString().padStart(2, "0");
  const minutes = dt.getMinutes().toString().padStart(2, "0");
  return `${dt.getDate()} ${INDONESIAN_MONTHS_FULL[dt.getMonth()]} ${dt.getFullYear()} pukul ${hours}:${minutes}`;
}

export function formatDateISO(date: DateInput): string {
  const dt = parseDate(date);
  if (!dt) return "";

  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatTimeHHMM(date: DateInput): string {
  const dt = parseDate(date);
  if (!dt) return "";

  const hh = String(dt.getHours()).padStart(2, "0");
  const mm = String(dt.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatDayDateIndo(date: DateInput): string {
  const dt = parseDate(date);
  if (!dt) return "";

  const dayName = INDONESIAN_DAYS[dt.getDay()];
  return `${dayName}, ${dt.getDate()} ${INDONESIAN_MONTHS_FULL[dt.getMonth()]} ${dt.getFullYear()}`;
}

export function formatTime(date: DateInput): string {
  if (!date) return "";
  if (typeof date === "string" && /^\d{2}:\d{2}:\d{2}\$/.test(date)) {
    return date.slice(0, 5); // Ambil jam:menit
  }

  const dt = parseDate(date);
  if (!dt) return "";

  const hours = dt.getHours().toString().padStart(2, "0");
  const minutes = dt.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatRelativeDay(dateString: string): string {
  if (!dateString) return "";

  const givenDate = new Date(dateString);
  const today = new Date();
  givenDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - givenDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "1 hari yang lalu";
  return `${diffDays} hari yang lalu`;
}

export function getEventStatus(eventDateStr: string) {
  const eventDate = new Date(eventDateStr);
  const today = new Date();
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays > 0)
    return { statusLabel: `H-${diffDays}`, statusColor: "text-success" };
  if (diffDays === 0)
    return { statusLabel: "D-Day", statusColor: "text-primary font-semibold" };
  return { statusLabel: `H+${Math.abs(diffDays)}`, statusColor: "text-error" };
}

export function checkIsPublished(
  publishStart: string | null | undefined,
  publishEnd: string | null | undefined,
): boolean {
  return !!publishStart && !!publishEnd;
}

// --- Kalkulasi Durasi ---

export function calculateDurationDays(
  startDate: string | Date,
  endDate: string | Date,
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return `${diffDays} hari`;
}

export function calculateDurationWithTime(
  startDate: string | Date,
  startTime: string,
  endDate: string | Date,
  endTime: string,
): { text: string; isError: boolean } {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end.getTime() - start.getTime();

  if (diffMs < 0)
    return { text: "Waktu selesai lebih awal dari waktu mulai", isError: true };

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  const text =
    days > 0
      ? hours > 0
        ? `${days} hari ${hours} jam`
        : `${days} hari`
      : `${hours} jam`;

  return { text, isError: days >= 1 };
}

export function calculateDurationMinute(
  startDate: string | Date,
  startTime: string,
  endDate: string | Date,
  endTime: string,
): { text: string; isError: boolean } {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const diffMs = end.getTime() - start.getTime();

  if (diffMs < 0)
    return { text: "Waktu selesai lebih awal dari waktu mulai", isError: true };

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const text =
    days > 0
      ? `${days} hari${hours > 0 ? ` \${hours} jam` : ""}${minutes > 0 ? ` \${minutes} menit` : ""}`
      : hours > 0
        ? `${hours} jam${minutes > 0 ? ` \${minutes} menit` : ""}`
        : `${minutes} menit`;

  return { text, isError: days >= 1 };
}

// --- Utility Lainnya ---

export function excelDateToString(excelDate: number | string): string {
  if (!excelDate) return "-";
  if (typeof excelDate === "string") return excelDate;
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const toDatetimeLocal = (value?: string): string => {
  if (!value) return "";
  return value.replace(" ", "T").slice(0, 16);
};

export function formatTimeAgo(
  dateString: string | Date | null | undefined,
): string {
  if (!dateString) return "";
  const dt = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(dt.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - dt.getTime();

  if (diffMs < 0) return "Baru saja";

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} hari yang lalu`;
  }
  if (hours > 0) {
    return `${hours} jam ${minutes} menit yang lalu`;
  }
  if (minutes > 0) {
    return `${minutes} menit yang lalu`;
  }
  return "Baru saja";
}

// 1. Usia dari Tanggal Lahir (Dob)
getAgeFromDob("2000-01-15"); // Hasil: "26 tahun 2 bulan 28 hari" (menyesuaikan tahun berjalan)
getAgeYearsOnly("2000-01-15"); // Hasil: "26 tahun"

// 2. Format Tanggal Indonesia
formatDateIndo("2026-11-26"); // Hasil: "26 November 2026"
formatDateIndo("2026-11-26", true); // Hasil: "26 Nov 2026" (Bulan pendek)
formatDateIndoWithTime("2026-11-26T15:30"); // Hasil: "26 November 2026 pukul 15:30"
formatDayDateIndo("2026-11-26"); // Hasil: "Kamis, 26 November 2026"

// 3. Format ISO & Waktu Saja
formatDateISO("2026-11-26"); // Hasil: "2026-11-26"
formatTimeHHMM("2026-11-26T15:30"); // Hasil: "15:30"
formatTime("14:45:00"); // Hasil: "14:45"

// 4. Status Relatif & Event
formatRelativeDay("2026-10-10"); // Hasil: "3 hari yang lalu"
getEventStatus("2026-10-15"); // Hasil: { statusLabel: "H-2", statusColor: "text-success" }
checkIsPublished("2026-10-01", "2026-10-10"); // Hasil: true

// 5. Kalkulasi Durasi
calculateDurationDays("2026-11-26", "2026-11-28"); // Hasil: "2 hari"
calculateDurationWithTime("2026-11-26", "08:00", "2026-11-27", "10:00");
// Hasil: { text: "1 hari 2 jam", isError: true }
calculateDurationMinute("2026-11-26", "08:00", "2026-11-26", "09:30");
// Hasil: { text: "1 jam 30 menit", isError: false }

// 6. Utility Konversi Lainnya
excelDateToString(45250); // Hasil konversi serial number Excel ke "YYYY-MM-DD"
toDatetimeLocal("2026-11-26 15:30:00"); // Hasil: "2026-11-26T15:30" (cocok untuk <input type="datetime-local">)
