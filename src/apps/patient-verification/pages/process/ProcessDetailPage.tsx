import Breadcrumb from "@/components/Breadcrumb";
import DataSection from "@/components/DataSection";

import { Info, ListTree, Pencil } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProcessDetail } from "@patient-verification/hooks/process/use-process-detail";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import FormSection from "@/components/FormSection";
import { capitalizeEachWord, toAllUppercase } from "@/utils/capitalizer";

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
                          Deskripsi
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.description || "-"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">
                          Status
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          <span
                            className={`badge ${
                              data.is_active === true
                                ? "badge-primary"
                                : "badge-error"
                            } badge-sm`}
                          >
                            {data.is_active ? "Aktif" : "Non Aktif"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">
                          Dibuat Oleh
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {toAllUppercase(data.created_by_name) || "-"}
                        </div>
                      </div>{" "}
                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">
                          Digunakan oleh Proses:
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {!data.used_by_processes ||
                          data.used_by_processes.length === 0 ? (
                            <span className="text-gray-500">Belum diatur</span>
                          ) : (
                            <ul className="list-disc list-inside space-y-1">
                              {data.used_by_processes.map((process, idx) => (
                                <li key={idx}>
                                  {capitalizeEachWord(process.name)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormSection>{" "}
                  <FormSection
                    title="Daftar Fields"
                    icon={ListTree}
                    color="primary"
                  >
                    <div className="divide-y divide-base-300/70">
                      <div className="hidden sm:grid sm:grid-cols-5 gap-4 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/60">
                        <div>Key / Label</div>
                        <div>Type</div>
                        <div>Placeholder</div>
                        <div className="text-center">Required</div>
                        <div className="text-center">Unique Identifier</div>
                      </div>

                      <div className="divide-y divide-base-300/50">
                        {data.fields_schema?.fields?.map((field, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-2 py-3 sm:grid sm:grid-cols-5 sm:items-center sm:gap-4"
                          >
                            <div>
                              <div className="text-sm font-medium text-base-content">
                                {field.label}
                              </div>
                              <div className="text-xs text-base-content/60 font-mono">
                                {field.key}
                              </div>
                            </div>
                            <div className="text-sm text-base-content/80">
                              {field.type}
                            </div>
                            <div className="text-sm text-base-content/80 font-mono">
                              {field.placeholder || "-"}
                            </div>
                            <div className="text-sm sm:text-center">
                              {field.required ? (
                                <span className="badge badge-sm badge-success badge-soft">
                                  Ya
                                </span>
                              ) : (
                                <span className="badge badge-sm badge-ghost">
                                  Tidak
                                </span>
                              )}
                            </div>
                            <div className="text-sm sm:text-center">
                              {field.unique_identifier ? (
                                <span className="badge badge-sm badge-primary badge-soft">
                                  Ya
                                </span>
                              ) : (
                                <span className="badge badge-sm badge-ghost">
                                  Tidak
                                </span>
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
