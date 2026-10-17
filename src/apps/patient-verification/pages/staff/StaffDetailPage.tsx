import Breadcrumb from "@/components/Breadcrumb";
import DataSection from "@/components/DataSection";

import { Briefcase, Pencil, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useStaffDetail } from "@patient-verification/hooks/staff/use-staff-detail";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import FormSection from "@/components/FormSection";
import { capitalizeEachWord } from "@/utils/capitalizer";

export default function StaffDetailPage() {
  const { staffId } = useParams<{ staffId: string }>();
  const { data, loading, error } = useStaffDetail(staffId);

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                {
                  label: "Dashboard",
                  path: "/app/patient-verification/dashboard",
                },
                { label: "Staff", path: "/app/patient-verification/staff" },
                {
                  label: capitalizeEachWord(data?.name) || "Detail staff",
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to={`/app/patient-verification/staff/${staffId}/edit`}
              icon={Pencil}
              color="warning"
              label="Edit Data"
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full">
          <div className="flex flex-col lg:flex-1 lg:min-h-0 relative md:overflow-auto gap-4">
            <DataSection
              loading={loading}
              error={error}
              data={data}
              emptyMessage="Belum Ada Data Staff"
            />

            {!loading && !error && data && (
              <>
                <div className="flex flex-row gap-4 border-b border-base-300 pb-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-base-content">
                    <User className="h-8 w-8" />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <h1 className="wrap-break-word text-xl font-bold tracking-tight text-base-content sm:text-2xl">
                      {data.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-2 text-sm">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            data.is_active === true ? "bg-success" : "bg-error"
                          }`}
                        />
                        <span
                          className={
                            data.is_active === true
                              ? "text-success font-medium"
                              : "text-error font-medium"
                          }
                        >
                          {data.is_active === true ? "Aktif" : "Nonaktif"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="">
                  <FormSection
                    title="Detail User"
                    icon={Briefcase}
                    color="primary"
                  >
                    <div className="divide-y divide-base-300/70">
                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">Unit</div>
                        <dd className="text-sm font-semibold text-base-content sm:text-right">
                          {data.departemen?.name || "-"}
                        </dd>
                      </div>

                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">
                          Jabatan
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.position || "-"}
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </div>
              </>
            )}
          </div>
        </Card>
      </PageMiddle>
    </div>
  );
}
