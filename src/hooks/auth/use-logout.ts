import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { showAlert } from "@/components/Swal";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await showAlert({
      title: "Apakah Anda yakin ingin logout?",
      text: "Anda akan keluar dari aplikasi dan perlu login kembali untuk mengaksesnya.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
      onClose: () => {},
    });

    if (result) {
      logout();
      navigate("/login");
      return true;
    }
    return false;
  };

  return { handleLogout };
}
