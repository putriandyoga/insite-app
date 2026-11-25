import { lazy } from "react";
import { useIsAdmin } from "@/utils/authHelper";

const DashboardPage = lazy(
  () => import("@patient-verification/pages/dashboard/DashboardPage"),
);
const DashboardAdminPage = lazy(
  () => import("@patient-verification/pages/dashboard/DashboardAdminPage"),
);

export const DashboardRouter = () => {
  const isAdmin = useIsAdmin();
  return isAdmin ? <DashboardAdminPage /> : <DashboardPage />;
};
