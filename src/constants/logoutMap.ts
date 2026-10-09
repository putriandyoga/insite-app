// C:\Project\Production\insite-react\src\constants\logoutMap.ts
import { iptvAuthService } from "@iptv/services/iptvAuthService";
// import { authService } from "@/services/authService"; // service utama jika ada

export const logoutMap: Record<string, () => Promise<any>> = {
  // Jika user berada di dalam modul iptv (/iptv/...)
  iptv: () => iptvAuthService.logout(),

  // Contoh jika modul lain punya endpoint logout sendiri:
  // inventory: () => inventoryAuthService.logout(),

  // Fallback default (misal mengarah ke auth utama)
  default: async () => {
    // return authService.logout();
  },
};
