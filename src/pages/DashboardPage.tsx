import { useAuthStore } from "@/store/useAuthStore";
import { hasPermission } from "@/utils/hasPermission";
import { getRoutePermission } from "@/routes/matchRoutePermission";
import { useMemo } from "react";
import { dashboardCards } from "@/constants/dashboardCardMap";
import ActionCard from "@/components/ActionCard";

const DashboardPage = () => {
  const { user } = useAuthStore();

  // 1. Filter kartu berdasarkan izin akses user secara efisien
  const { staffCards, clientCards, allowedCards } = useMemo(() => {
    const allowed = dashboardCards.filter((card) => {
      const permission = getRoutePermission(card.path);
      if (!permission) return true; // Fallback untuk kartu publik
      return hasPermission(user, permission);
    });

    const staff = allowed.filter((card) => !card.path.includes("/client"));
    const client = allowed.filter((card) => card.path.includes("/client"));

    return { staffCards: staff, clientCards: client, allowedCards: allowed };
  }, [user]);

  return (
    <div className="flex flex-col gap-8 max-w-full">
      {/* RENDER INTERNAL SECTION */}
      {staffCards.length > 0 && (
        <div>
          <div className="divider font-bold text-lg mb-4">
            Internal Staff Dashboard
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffCards.map((card) => (
              <ActionCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      )}

      {/* RENDER CLIENT SECTION */}
      {clientCards.length > 0 && (
        <div>
          <div className="divider font-bold text-lg mb-4 text-info">
            Client Portal
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientCards.map((card) => (
              <ActionCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      )}

      {/* RENDER JIKA TIDAK ADA AKSES SAMA SEKALI */}
      {allowedCards.length === 0 && (
        <div className="hero bg-base-200 min-h-100 rounded-2xl border border-dashed border-base-300">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-xl font-bold text-error mb-2">
                Akses Terbatas
              </h1>
              <p className="text-sm text-base-content/60">
                Akun Anda saat ini tidak memiliki permission profile yang valid
                untuk mengakses modul platform. Silakan hubungi tim administrasi
                IT untuk pembaruan role akses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
