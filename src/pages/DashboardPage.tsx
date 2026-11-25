import { useAuthStore } from "@/store/useAuthStore";
import { hasPermission } from "@/utils/hasPermission";
import { getRoutePermission } from "@/routes/matchRoutePermission";
import { useMemo } from "react";
import { dashboardCards } from "@/constants/dashboardCardMap";
import ActionCard from "@/components/ActionCard";
import { showAlert } from "@/utils/showAlert";

const DashboardPage = () => {
  const { user } = useAuthStore();

  const handleTestSuccess = async () => {
    await showAlert({
      title: "Berhasil!",
      text: "Data IPTV berhasil disimpan ke server.",
      icon: "success",
      showConfirmButton: true,
      confirmButtonText: "Baik, Mengerti",
    });
  };

  const handleTestError = async () => {
    await showAlert({
      title: "Gagal Memproses",
      text: "Terjadi kesalahan saat menghubungkan ke perangkat verifikasi pasien.",
      icon: "error",
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "error",
    });
  };

  const handleTestWarning = async () => {
    await showAlert({
      title: "Peringatan Sistem",
      text: "Koneksi jaringan tidak stabil, beberapa data mungkin terlambat disinkronkan.",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Coba Lagi",
      cancelButtonText: "Abaikan",
      confirmButtonColor: "warning",
    });
  };

  const handleTestInfo = async () => {
    await showAlert({
      title: "Informasi Pemeliharaan",
      text: "Sistem IPTV akan melakukan maintenance rutin pada pukul 00:00 WIB.",
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "Paham",
    });
  };

  const handleTestQuestion = async () => {
    const isConfirmed = await showAlert({
      title: "Konfirmasi Tindakan",
      text: "Apakah Anda yakin ingin mereset ulang konfigurasi perangkat ini?",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Ya, Reset",
      cancelButtonText: "Batal",
      confirmButtonColor: "primary",
    });

    if (isConfirmed) {
      console.log("Pengguna menekan Ya, Reset!");
    } else {
      console.log("Pengguna membatalkan tindakan.");
    }
  };

  const handleTestTimer = async () => {
    await showAlert({
      title: "Pemberitahuan Otomatis",
      text: "Pesan ini akan tertutup sendiri dalam 3 detik.",
      icon: "info",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const handleTestVerifyText = async () => {
    await showAlert({
      title: "Hapus Data Penting",
      text: "Tindakan ini permanen dan tidak dapat dibatalkan.",
      icon: "error",
      verifyText: "HAPUS",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Konfirmasi Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "error",
    });
  };

  const handleTestExtraButton = async () => {
    await showAlert({
      title: "Laporan Tersedia",
      text: "File rekapitulasi data verifikasi pasien bulan ini sudah siap diunduh.",
      icon: "success",
      showConfirmButton: true,
      confirmButtonText: "Selesai",
      extraButtonText: "Download Excel",
      extraButtonPath: "/files/rekap-pasien.xlsx",
    });
  };

  const { staffCards, clientCards, allowedCards } = useMemo(() => {
    const allowed = dashboardCards.filter((card) => {
      const permission = getRoutePermission(card.path);
      if (!permission) return true;
      return hasPermission(user, permission);
    });

    const staff = allowed.filter((card) => !card.path.includes("/client"));
    const client = allowed.filter((card) => card.path.includes("/client"));

    return { staffCards: staff, clientCards: client, allowedCards: allowed };
  }, [user]);

  return (
    <div className="flex flex-col gap-8 max-w-full">
      <div className="bg-base-200 p-5 rounded-lg border border-base-300">
        <h2 className="text-sm font-bold text-base-content uppercase tracking-wider mb-3">
          🛠️ Panel Playground Test Alert (`showAlert`)
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleTestSuccess}
            className="btn btn-sm btn-success text-white"
          >
            Success Alert
          </button>
          <button
            onClick={handleTestError}
            className="btn btn-sm btn-error text-white"
          >
            Error Alert
          </button>
          <button
            onClick={handleTestWarning}
            className="btn btn-sm btn-warning text-white"
          >
            Warning Alert
          </button>
          <button
            onClick={handleTestInfo}
            className="btn btn-sm btn-info text-white"
          >
            Info Alert
          </button>
          <button
            onClick={handleTestQuestion}
            className="btn btn-sm btn-primary"
          >
            Question Confirm
          </button>
          <button onClick={handleTestTimer} className="btn btn-sm btn-neutral">
            Timer (3s)
          </button>
          <button
            onClick={handleTestVerifyText}
            className="btn btn-sm btn-outline btn-error"
          >
            Verify Input Dialog
          </button>
          <button
            onClick={handleTestExtraButton}
            className="btn btn-sm btn-outline btn-success"
          >
            Extra Button (Download)
          </button>
        </div>
      </div>

      {staffCards.length > 0 && (
        <div>
          <div className="divider font-bold text-lg mb-4">
            Internal Staff Dashboard
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffCards.map((card) => (
              <ActionCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      )}

      {clientCards.length > 0 && (
        <div>
          <div className="divider font-bold text-lg mb-4 text-info">
            Client Portal
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientCards.map((card) => (
              <ActionCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      )}

      {allowedCards.length === 0 && (
        <div className="hero bg-base-200 min-h-100 rounded-2xl border border-dashed border-base-300">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-xl font-bold text-error mb-2">
                Akses Terbatas
              </h1>
              <p className="text-sm text-base-content/60">
                Akun Anda saat ini tidak memiliki permission profile yang valid
                untuk mengakses modul platform. Silakan hubungi tim administrasi
                IT untuk pembaruan role akses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
