import { userService } from "@iptv/services/userService"; // sesuaikan path import service Anda
import {
  defaultUser,
  validateUser,
  type UserItem,
} from "@iptv/types/userTypes"; // sesuaikan path
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useUserForm(userId?: string) {
  return useBaseForm<UserItem>({
    id: userId,
    entityName: "User",
    defaultValues: defaultUser,
    queryKey: queryKeys.user.detail(userId || ""),
    invalidateQueryKey: queryKeys.user.lists(),
    getDetail: userService.getDetail,
    createFn: userService.create,
    updateFn: userService.update,
    validate: validateUser,

    // Bersihkan payload sebelum dikirim ke backend
    transformBeforeSubmit: (data) => {
      // Buat salinan data agar tidak memutasi state secara langsung
      const payload = { ...data };

      // Hapus properti objek 'station' jika ada, karena backend biasanya hanya butuh 'station_id'
      delete (payload as any).station;

      // Jika station_id kosong (string kosong), ubah menjadi null atau undefined
      // agar backend tahu bahwa station dihapus/dikosongkan
      if (!payload.station_id || payload.station_id === "") {
        payload.station_id = null; // atau undefined, sesuaikan dengan yang diminta backend Anda
      }

      return payload;
    },

    redirectTo: "/app/iptv/user",
    messages: {
      createSuccess: "User berhasil dibuat",
      updateSuccess: "User berhasil diperbarui",
      fetchError: "Tidak dapat mengambil data User",
    },
  });
}
