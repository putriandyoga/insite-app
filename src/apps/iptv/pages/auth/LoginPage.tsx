// C:\Project\Production\insite-react\src\modules\iptv\pages\auth\LoginPage.tsx
import { User, LockKeyhole, Tv } from "lucide-react";
import { useLogin } from "@iptv/hooks/auth/use-login";
import { BaseLoginForm, type FieldConfig } from "@/components/BaseLoginForm";

export default function LoginPage() {
  const { login, loading } = useLogin();

  const loginFields: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
      autoComplete: "username",
      icon: <User size={19} strokeWidth={1.8} />,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      autoComplete: "current-password",
      icon: <LockKeyhole size={19} strokeWidth={1.8} />,
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    await login({
      username: values.username,
      password: values.password,
    });
  };

  return (
    <BaseLoginForm
      title="Welcome back"
      icon={<Tv size={38} strokeWidth={1.7} className="text-primary" />}
      fields={loginFields}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
