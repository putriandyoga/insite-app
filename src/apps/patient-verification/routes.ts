import { createElement, lazy } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { DashboardRouter } from "@/components/DashboardRouter";
import { PatientVerificationSyncWrapper } from "./components/PatientVerificationSyncWrapper";

const DepartementPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementPage"),
);
const DepartementFormPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementFormPage"),
);
const DepartementDetailPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementDetailPage"),
);

const StaffPage = lazy(
  () => import("@patient-verification/pages/staff/StaffPage"),
);
const StaffFormPage = lazy(
  () => import("@patient-verification/pages/staff/StaffFormPage"),
);
const StaffDetailPage = lazy(
  () => import("@patient-verification/pages/staff/StaffDetailPage"),
);

const ContextPage = lazy(
  () => import("@patient-verification/pages/context/ContextPage"),
);
const ContextFormPage = lazy(
  () => import("@patient-verification/pages/context/ContextFormPage"),
);
const ContextDetailPage = lazy(
  () => import("@patient-verification/pages/context/ContextDetailPage"),
);

const ProcessPage = lazy(
  () => import("@patient-verification/pages/process/ProcessPage"),
);
const ProcessFormPage = lazy(
  () => import("@patient-verification/pages/process/ProcessFormPage"),
);
const ProcessDetailPage = lazy(
  () => import("@patient-verification/pages/process/ProcessDetailPage"),
);

const InstancesPage = lazy(
  () => import("@patient-verification/pages/instances/InstancesPage"),
);

export const patientVerificationRoutes: RouteObject = {
  path: "patient-verification",
  element: createElement(PatientVerificationSyncWrapper),
  children: [
    { path: "dashboard", element: createElement(DashboardRouter) },
    {
      element: createElement(
        ProtectedRoute,
        { requiredRole: "admin" },
        createElement(Outlet),
      ),
      children: [
        {
          path: "departement",
          children: [
            { index: true, element: createElement(DepartementPage) },
            { path: "create", element: createElement(DepartementFormPage) },
            {
              path: ":departementId",
              element: createElement(DepartementDetailPage),
            },
            {
              path: ":departementId/edit",
              element: createElement(DepartementFormPage),
            },
          ],
        },
        {
          path: "staff",
          children: [
            { index: true, element: createElement(StaffPage) },
            { path: "create", element: createElement(StaffFormPage) },
            { path: ":staffId", element: createElement(StaffDetailPage) },
            { path: ":staffId/edit", element: createElement(StaffFormPage) },
          ],
        },
        {
          path: "context",
          children: [
            { index: true, element: createElement(ContextPage) },
            { path: "create", element: createElement(ContextFormPage) },
            { path: ":contextId", element: createElement(ContextDetailPage) },
            {
              path: ":contextId/edit",
              element: createElement(ContextFormPage),
            },
          ],
        },
        {
          path: "process",
          children: [
            { index: true, element: createElement(ProcessPage) },
            { path: "create", element: createElement(ProcessFormPage) },
            { path: ":processId", element: createElement(ProcessDetailPage) },
            {
              path: ":processId/edit",
              element: createElement(ProcessFormPage),
            },
          ],
        },
        {
          path: "instances",
          children: [{ index: true, element: createElement(InstancesPage) }],
        },
      ],
    },
  ],
};
