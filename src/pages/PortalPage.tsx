import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Building2, ShieldAlert, Users } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";
import { hasPermission } from "@/utils/hasPermission";
import { getRoutePermission } from "@/routes/matchRoutePermission";
import { dashboardCards } from "@/constants/dashboardCardMap";
import TitleSection from "@/components/TitleSection";

const PortalPage = () => {
  const { user } = useAuthStore();
  const reduceMotion = useReducedMotion();

  // --- FILTER KARTU DASHBOARD ---
  const { staffCards, clientCards, allowedCards } = useMemo(() => {
    const allowed = dashboardCards.filter((card) => {
      const permission = getRoutePermission(card.path);
      if (!permission) return true;
      return hasPermission(user, permission);
    });

    const staff = allowed.filter((card) => card.path.includes("/app"));
    const client = allowed.filter((card) => card.path.includes("/client"));

    return { staffCards: staff, clientCards: client, allowedCards: allowed };
  }, [user]);

  return (
    <div className="flex flex-col gap-8 max-w-full">
      {staffCards.length > 0 && (
        <TitleSection
          title="Dashboard Staf Internal"
          description="Modul operasional terpadu untuk seluruh pegawai rumah sakit"
          icon={Building2}
          cards={staffCards}
          delay={0.08}
        />
      )}

      {/* SEKSI PORTAL KLIEN */}
      {clientCards.length > 0 && (
        <TitleSection
          title="Portal Klien"
          description="Layanan untuk pasien dan mitra"
          icon={Users}
          cards={clientCards}
          delay={0.16}
        />
      )}

      {/* TIDAK ADA AKSES SAMA SEKALI */}
      {allowedCards.length === 0 && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          role="alert"
          className="flex min-h-75 items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-100 p-8"
        >
          <div className="max-w-md space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <ShieldAlert size={24} strokeWidth={1.75} />
            </div>
            <h2 className="text-lg font-semibold text-base-content">
              Akses Terbatas
            </h2>
            <p className="text-sm leading-relaxed text-base-content/60">
              Akun Anda saat ini belum memiliki <em>permission profile</em> yang
              valid untuk mengakses modul platform. Silakan hubungi tim IT untuk
              pembaruan role akses.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PortalPage;
