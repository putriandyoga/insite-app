import Breadcrumb from "@/components/Breadcrumb";
import DataSection from "@/components/DataSection";

import { Briefcase, Pencil } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDepartementDetail } from "@patient-verification/hooks/departement/use-departement-detail";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import FormSection from "@/components/FormSection";
import { capitalizeEachWord } from "@/utils/capitalizer";

export default function DepartementDetailPage() {
  const { departementId } = useParams<{ departementId: string }>();
  const { data, loading, error } = useDepartementDetail(departementId);

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
                {
                  label: "Departement",
                  path: "/app/patient-verification/departement",
                },
                {
                  label: capitalizeEachWord(data?.name) || "Detail departement",
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to={`/app/patient-verification/departement/${departementId}/edit`}
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
              emptyMessage="Belum Ada Data Departement"
            />

            {!loading && !error && data && (
              <>
                <div className="flex flex-row items-center gap-4 border-b border-base-300 pb-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-base-content">
                    <Briefcase className="h-8 w-8" />
                  </div>

                  <h1 className="wrap-break-word text-xl font-bold tracking-tight text-base-content sm:text-2xl">
                    {data.name}
                  </h1>
                </div>
                <div className="">
                  <FormSection
                    title="Detail User"
                    icon={Briefcase}
                    color="primary"
                  >
                    <div className="divide-y divide-base-300/70">
                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">
                          Jumlah Staff
                        </div>
                        <dd className="text-sm font-semibold text-base-content sm:text-right">
                          {data.staffs_count || "-"}
                        </dd>
                      </div>

                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">
                          Jumlah User
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.users_count || "-"}
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
