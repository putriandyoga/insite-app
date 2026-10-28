import Breadcrumb from "@/components/Breadcrumb";
import DataSection from "@/components/DataSection";

import { Check, Eye, Info, Pencil, Workflow, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProcessDetail } from "@patient-verification/hooks/process/use-process-detail";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import FormSection from "@/components/FormSection";
import { capitalizeEachWord, toAllUppercase } from "@/utils/capitalizer";
import { getProcessStatusInfo } from "@patient-verification/constants/processStatusMap";

export default function ProcessDetailPage() {
  const { processId } = useParams<{ processId: string }>();
  const { data, loading, error } = useProcessDetail(processId);

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
                  label: "Process Template",
                  path: "/app/patient-verification/process",
                },
                {
                  label: capitalizeEachWord(data?.name) || "Detail process",
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to={`/app/patient-verification/process/${processId}/edit`}
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
              emptyMessage="Belum Ada Data Process"
            />

            {!loading && !error && data && (
              <>
                <div className="flex flex-row items-center gap-4 border-b border-base-300 pb-2">
                  <h1 className="wrap-break-word text-xl font-bold tracking-tight text-base-content sm:text-2xl">
                    {data.name}
                  </h1>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <FormSection
                      title="Informasi Template"
                      icon={Info}
                      color="primary"
                    >
                      <div className="divide-y divide-base-300/70">
                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="text-sm text-base-content/60">
                            Nama Template
                          </div>
                          <dd className="text-sm font-semibold text-base-content sm:text-right">
                            {data.name || "-"}
                          </dd>
                        </div>
                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="text-sm text-base-content/60">
                            Version
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            V {data.version || "-"}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="text-sm text-base-content/60">
                            Deskripsi
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            {data.description || "-"}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="text-sm text-base-content/60">
                            Context Template
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            <div className="flex items-center justify-between gap-4 w-full">
                              <div className="flex flex-col">
                                {data.context_template ? (
                                  <span>
                                    {data.context_template.name || "Tanpa Nama"}
                                  </span>
                                ) : (
                                  <span className="italic text-base-content/40">
                                    Belum diatur
                                  </span>
                                )}
                              </div>

                              {data.context_template?.id && (
                                <ActionButton
                                  to={`/app/patient-verification/context/${data.context_template.id}`}
                                  icon={Eye}
                                  color="primary"
                                  tooltip="Lihat Context"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="text-sm text-base-content/60">
                            Status
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            {(() => {
                              const statusInfo = getProcessStatusInfo(
                                data.status,
                              );

                              return (
                                <span
                                  className={`badge badge-sm font-medium ${statusInfo.color}`}
                                >
                                  {statusInfo.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="text-sm text-base-content/60">
                            Dibuat Oleh
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            {toAllUppercase(data.created_by_name) || "-"}
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  <FormSection
                    title="Daftar Stages"
                    icon={Workflow}
                    color="primary"
                  >
                    <div className="divide-y divide-base-300/70">
                      <div className="hidden sm:grid sm:grid-cols-5 gap-4 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/60">
                        <div className="text-center">Urutan</div>
                        <div>Nama Stage</div>
                        <div>Departemen</div>
                        <div className="text-center">Required</div>
                        <div className="text-center">Mandatory Dept</div>
                      </div>

                      <div className="divide-y divide-base-300/50">
                        {data.stages?.map((stage) => (
                          <div
                            key={stage.id}
                            className="flex flex-col gap-2 py-3 sm:grid sm:grid-cols-5 sm:items-center sm:gap-4"
                          >
                            <div className="text-center">
                              {stage.stage_order}
                            </div>

                            <div>
                              <div className="text-sm font-medium text-base-content">
                                {stage.stage_name}
                              </div>
                            </div>

                            <div className="text-sm">
                              {stage.departments?.map((dept) => (
                                <div key={dept.id}>{dept.departemen_name}</div>
                              ))}
                            </div>

                            <div className="text-sm sm:flex sm:justify-center">
                              {stage.is_required ? (
                                <Check className="w-4 h-4 text-primary" />
                              ) : (
                                <X className="w-4 h-4 text-base-content/40" />
                              )}
                            </div>

                            <div className="text-sm sm:flex sm:justify-center">
                              {stage.departments?.some(
                                (d) => d.is_mandatory,
                              ) ? (
                                <Check className="w-4 h-4 text-primary" />
                              ) : (
                                <X className="w-4 h-4 text-base-content/40" />
                              )}
                            </div>
                          </div>
                        ))}
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
