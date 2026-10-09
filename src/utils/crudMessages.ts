export interface CrudMessages {
  // validation
  validationTitle?: string;

  // success
  createSuccess?: string;
  updateSuccess?: string;
  deleteSuccess?: string;

  // error
  fetchError?: string;
  createError?: string;
  updateError?: string;
  deleteError?: string;

  // confirm delete
  deleteConfirmTitle?: string;
  deleteConfirmText?: string;

  // loading
  loadingText?: string;

  // generic
  successTitle?: string;
  errorTitle?: string;
}

export const defaultCrudMessages = (
  entity = "data",
): Required<CrudMessages> => ({
  // validation
  validationTitle: "Perhatian",

  // success
  createSuccess: `${entity} berhasil dibuat!`,
  updateSuccess: `${entity} berhasil diperbarui!`,
  deleteSuccess: `${entity} berhasil dihapus!`,

  // error
  fetchError: `Tidak dapat mengambil ${entity}.`,
  createError: `Gagal membuat ${entity}.`,
  updateError: `Gagal memperbarui ${entity}.`,
  deleteError: `Gagal menghapus ${entity}.`,

  // delete confirm
  deleteConfirmTitle: `Hapus ${entity}?`,
  deleteConfirmText: `${entity} akan dihapus secara permanen.`,

  // loading
  loadingText: "Memproses data...",

  // generic
  successTitle: "Berhasil",
  errorTitle: "Terjadi Kesalahan",
});
