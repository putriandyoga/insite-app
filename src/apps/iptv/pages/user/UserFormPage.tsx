import { useParams } from "react-router-dom";
import { User } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useUserForm } from "@iptv/hooks/user/use-user-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { useStationList } from "@iptv/hooks/station/use-station-list";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import { UserProfileCard } from "@iptv/components/UserProfileCard";

const UserFormPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const isEditMode = Boolean(userId);

  const { data, setField, loading, saving, handleSubmit } = useUserForm(userId);

  const { data: stationList, loading: stationLoading } = useStationList(
    1,
    undefined,
    100,
  );

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Perawat", value: "nurse" },
  ];

  if (loading) return <IndicatorLoading />;

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "User", path: "/app/iptv/user" },
                {
                  label: isEditMode ? "Edit" : "Buat",
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="h-9"></div>
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full">
          {isEditMode && <UserProfileCard data={data} />}

          <FormSection title="Data User" icon={User} color="primary">
            <FormInput
              label="Username"
              type="text"
              required
              value={data.username || ""}
              onChange={(val) => setField("username", val)}
              placeholder="Masukkan username"
            />
            {!isEditMode && (
              <FormInput
                label="Password"
                type="password"
                required={!isEditMode}
                value={data.password || ""}
                onChange={(val) => setField("password", val)}
                placeholder="Masukkan password"
              />
            )}

            <FormInput
              label="Role"
              required
              options={roleOptions}
              value={data.role || ""}
              onChange={(val) => setField("role", val)}
              dropdownType="select"
            />

            <FormInput
              label="Station"
              required
              options={
                Array.isArray(stationList)
                  ? stationList.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  : []
              }
              dropdownType="select"
              value={data.station_id || ""}
              onChange={(val) => setField("station_id", val)}
              disabled={stationLoading}
            />
          </FormSection>
        </Card>
      </PageMiddle>

      <PageBottom>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo={`/app/iptv/user/${userId}`}
          cancelCreateTo="/app/iptv/user"
        />
      </PageBottom>
    </div>
  );
};

export default UserFormPage;
