// // C:\Project\Production\insite-react\src\hooks\useLogin.ts
// import { useNavigate } from "react-router-dom";
// import { useAuthStore, type UserData } from "@/store/useAuthStore";
// import { ApiError } from "@/services/api/apiError";
// import { iptvAuthService } from "@iptv/services/iptvAuthService";
// import { showAlert } from "@/components/Alert";

// export function useLogin() {
//   const navigate = useNavigate();
//   const { login } = useAuthStore();

//   const loginUser = async (username: string, password: string) => {
//     try {
//       // 1. Panggil service login IPTV
//       const result = await iptvAuthService.login({ username, password });

//       const user = result.user;

//       // 2. Mapping data ke format UserData Zustand store
//       // Karena autentikasi menggunakan cookie, field 'token' diisi string kosong/dummy.
//       const userData: UserData = {
//         id: user?.id ?? "",
//         email: user?.email ?? `${user?.username ?? username}@iptv.local`,
//         token: "COOKIE_SESSION_ACTIVE", // Penanda bahwa sesi dikelola via Cookie
//         role: user?.role ?? "admin",
//         permissions: [], // Jika backend IPTV ada permissions, bisa disesuaikan
//       };

//       // 3. Simpan ke Zustand store & localStorage
//       login("COOKIE_SESSION_ACTIVE", userData);

//       await showAlert({
//         title: "Login Berhasil",
//         text: "Selamat datang kembali!",
//         icon: "success",
//         timer: 1000,
//         showConfirmButton: false,
//         onClose: () => navigate("/dashboard"),
//       });
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof ApiError
//           ? err.message
//           : "Terjadi kesalahan saat menghubungi server.";

//       await showAlert({
//         title: "Login Gagal",
//         text: errorMessage,
//         icon: "error",
//         confirmButtonText: "Coba Lagi",
//         showConfirmButton: true,
//       });
//     }
//   };

//   return { loginUser };
// }
import { iptvAuthService } from "@iptv/services/iptvAuthService";
import { useBaseLogin } from "@/hooks/core/use-base-login";

export function useLogin() {
  return useBaseLogin({
    loginFn: (payload: { username: string; password: string }) =>
      iptvAuthService.login(payload),
    transformUser: (result) => ({
      id: result.user.id,
      email: `${result.user.username}@iptv.local`,
      token: "COOKIE_SESSION_ACTIVE",
      role: result.user.role,
      permissions: [],
    }),
    redirectTo: "/iptv/dashboard",
  });
}
