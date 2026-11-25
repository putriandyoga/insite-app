import { Save, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { showAlert } from "@/utils/showAlert";

interface FormActionsProps {
  /** submit */
  onSubmit: () => void;
  saving: boolean;
  isEditMode: boolean;

  /** cancel navigation */
  cancelEditTo: string;
  cancelCreateTo: string;

  /** optional */
  createLabel?: string;
  editLabel?: string;
  submitType?: "button" | "submit";
  disabled?: boolean;
  className?: string;

  /** optional icon override */
  iconCreate?: ReactNode;
  iconEdit?: ReactNode;
}

export default function FormActions({
  onSubmit,
  saving,
  isEditMode,
  cancelEditTo,
  cancelCreateTo,
  createLabel = "Simpan Data",
  editLabel = "Simpan Perubahan",
  submitType = "button",
  disabled = false,
  className = "",
  iconCreate = <Save size={20} />,
  iconEdit = <Send size={20} />,
}: FormActionsProps) {
  const navigate = useNavigate();

  const handleCancel = async () => {
    const result = await showAlert({
      title: "Batalkan perubahan?",
      text: "Data yang sudah diisi akan hilang.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, batalkan",
      confirmButtonColor: "error",
      cancelButtonText: "Lanjutkan",
    });

    if (result) {
      navigate(isEditMode ? cancelEditTo : cancelCreateTo);
    }
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      <button
        type="button"
        onClick={handleCancel}
        className="px-6 py-3 bg-base-100 hover:bg-base-300 text-data-body
        border border-base-300 rounded-lg font-semibold transition-all"
      >
        Batal
      </button>

      <button
        type={submitType}
        onClick={submitType === "button" ? onSubmit : undefined}
        disabled={saving || disabled}
        className="flex-1 px-6 py-3 bg-primary/80 hover:bg-primary
        text-primary-content rounded-lg font-semibold transition-all
        shadow-lg hover:shadow-xl flex items-center justify-center gap-2
        disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            {isEditMode ? iconEdit : iconCreate}
            {isEditMode ? editLabel : createLabel}
          </>
        )}
      </button>
    </div>
  );
}
