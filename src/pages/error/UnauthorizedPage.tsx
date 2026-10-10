import ActionButton from "@/components/ActionButton";
import { LogIn, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center w-full">
        {/* Nomor Error */}
        <div className="mb-6">
          <h1 className="text-[140px] lg:text-[180px] font-black text-primary leading-none select-none">
            401
          </h1>
        </div>

        {/* Informasi Utama */}
        <div className="space-y-3 mb-10">
          <h2 className="heading-h2 text-base-content">
            Akses Sesi Anda Telah Kedaluwarsa
          </h2>

          <p className="text-body max-w-lg mx-auto">
            Kredensial atau token sesi Anda tidak valid maupun telah habis masa
            berlakunya. Silakan masuk kembali untuk melanjutkan pengelolaan
            sistem.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <ActionButton
            to="/app/iptv/login"
            icon={LogIn}
            label="Masuk Kembali"
            color="primary"
            size={20}
            className="px-6 py-3.5 rounded-2xl shadow-lg"
          />

          <ActionButton
            onClick={() => window.history.back()}
            icon={ArrowLeft}
            label="Halaman Sebelumnya"
            color="base-300"
            size={20}
            className="px-6 py-3.5 rounded-2xl border-2 border-base-300"
          />
        </div>
      </div>
    </div>
  );
}
