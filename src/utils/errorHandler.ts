import { showAlert } from "@/utils/showAlert";

export async function handleApiError(
  err: unknown,
  fallbackMessage = "Terjadi kesalahan yang tidak diketahui.",
) {
  let message = fallbackMessage;

  try {
    const errorObj = err as {
      response?: {
        data?: {
          errors?: Record<string, string[] | string>;
          meta?: { message?: string };
          message?: string;
        };
      };
      errors?: Record<string, string[] | string>;
      meta?: { message?: string };
      message?: string;
    };

    const data = errorObj?.response?.data ?? errorObj;

    if (data?.errors && typeof data.errors === "object") {
      const errorMessages = Object.values(data.errors).flat().join("\n");
      if (errorMessages) {
        message = errorMessages;
      }
    } else if (data?.meta?.message) {
      message = data.meta.message;
    } else if (data?.message) {
      message = data.message;
    }
  } catch (parseError) {
    // Tetap gunakan fallbackMessage jika struktur error tidak sesuai ekspektasi.
    console.warn("Gagal mengekstrak pesan error API:", parseError);
  }

  await showAlert({
    title: "Gagal",
    text: message,
    icon: "error",
    confirmButtonText: "Mengerti",
    showConfirmButton: true,
  });
}
