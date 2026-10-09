// C:\Project\Production\insite-react\src\components\core\BaseLoginForm.tsx
import { useState, type ReactNode } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  icon: ReactNode;
}

interface BaseLoginFormProps {
  title: string;
  icon: ReactNode;
  fields: FieldConfig[];
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
  loading?: boolean;
}

export function BaseLoginForm({
  title,
  icon,
  fields,
  onSubmit,
  loading = false,
}: BaseLoginFormProps) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}),
  );

  const [showPasswordMap, setShowPasswordMap] = useState<
    Record<string, boolean>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = (fieldName: string) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="p-6 space-y-4 flex flex-col items-center justify-center h-full">
      <div className="backdrop-blur-lg bg-base-100/30 border border-white/40 shadow-2xl rounded-2xl p-2 flex flex-col items-center relative z-10 w-full max-w-md">
        <div className="p-4 w-full">
          {/* Logo / Header Icon */}
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-md shadow-primary/10">
              {icon}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              {title}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {fields.map((field) => {
              const isPasswordField = field.type === "password";
              const isVisible = showPasswordMap[field.name] || false;
              const inputType = isPasswordField
                ? isVisible
                  ? "text"
                  : "password"
                : field.type || "text";

              return (
                <div className="form-control" key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 text-sm font-semibold text-base-content"
                  >
                    {field.label}
                  </label>

                  <label className="input input-bordered flex h-12 w-full items-center gap-3 rounded-xl bg-base-100 transition-all focus-within:border-primary focus-within:outline focus-within:outline-primary/20">
                    <span className="shrink-0 text-base-content/40">
                      {field.icon}
                    </span>

                    <input
                      id={field.name}
                      type={inputType}
                      name={field.name}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="grow text-sm"
                    />

                    {isPasswordField && (
                      <button
                        type="button"
                        onClick={() => toggleShowPassword(field.name)}
                        disabled={loading}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        className="flex shrink-0 items-center justify-center text-base-content/45 transition-colors hover:text-base-content"
                      >
                        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </label>
                </div>
              );
            })}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary mt-2 h-12 min-h-12 w-full rounded-xl border-0 text-sm font-semibold shadow-md shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 disabled:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Signing you in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
