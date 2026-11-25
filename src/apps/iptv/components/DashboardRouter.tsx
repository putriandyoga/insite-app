import { lazy } from "react";
import { useIsAdmin } from "@/utils/authHelper";

const AdminDashboardPage = lazy(() => import("@iptv/pages/call/CallPage"));
const PanelPage = lazy(() => import("@iptv/pages/dashboard/DashboardPage"));

export const DashboardRouter = () => {
  const isAdmin = useIsAdmin();
  return isAdmin ? <AdminDashboardPage /> : <PanelPage />;
};
