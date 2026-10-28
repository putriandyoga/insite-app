// hooks/panel/use-nurse-audio.ts
import { useState, useEffect, useRef } from "react";

export function useNurseAudio(calls: any[]) {
  const [suaraTersedia, setSuaraTersedia] = useState<boolean>(() => {
    return localStorage.getItem("nurse_audio_unlocked") === "true";
  });
  const [berbunyi, setBerbunyi] = useState<boolean>(false);
  const [tampilkanTombolSuara, setTampilkanTombolSuara] = useState<boolean>(
    () => {
      return localStorage.getItem("nurse_audio_unlocked") !== "true";
    },
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Minta izin Notification API saat pertama kali dimuat
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Inisialisasi Audio
  useEffect(() => {
    const audio = new Audio("/assets/alarm.mp3");
    audio.loop = true;
    audioRef.current = audio;

    const handleGlobalClick = async () => {
      if (audioRef.current && !suaraTersedia) {
        try {
          audioRef.current.muted = true;
          await audioRef.current.play();
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;

          setSuaraTersedia(true);
          setTampilkanTombolSuara(false);
          localStorage.setItem("nurse_audio_unlocked", "true");
          window.removeEventListener("click", handleGlobalClick);
        } catch (e) {
          // Abaikan
        }
      }
    };

    if (!suaraTersedia) {
      window.addEventListener("click", handleGlobalClick);
    }

    return () => {
      window.removeEventListener("click", handleGlobalClick);
      audio.pause();
      audioRef.current = null;
    };
  }, [suaraTersedia]);

  // Pantau panggilan aktif (Termasuk saat di tab lain)
  useEffect(() => {
    const adaYangMenunggu = calls.some((c: any) => c.status === "PENDING");
    const audio = audioRef.current;

    if (!audio) return;

    if (adaYangMenunggu) {
      // Jika ada call baru, tampilkan juga Notifikasi Desktop OS (Muncul walau di tab lain)
      if (
        !berbunyi &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        const pendingCalls = calls.filter((c: any) => c.status === "PENDING");
        const latestCall = pendingCalls[pendingCalls.length - 1];

        new Notification("Panggilan Perawat Masuk!", {
          body: `Ruangan: ${latestCall?.room_label || "Unknown"} membutuhkan bantuan.`,
          icon: "/favicon.svg", // Sesuaikan icon app Anda
          requireInteraction: true, // Agar notifikasi tidak hilang sendiri sebelum diklik
        });
      }

      if (!berbunyi && suaraTersedia) {
        audio
          .play()
          .then(() => {
            setBerbunyi(true);
          })
          .catch(() => {
            // Browser memblokir karena tab di-background
            setTampilkanTombolSuara(true);
          });
      }
    } else {
      if (berbunyi) {
        audio.pause();
        audio.currentTime = 0;
        setBerbunyi(false);
      }
    }
  }, [calls, berbunyi, suaraTersedia]);

  const bukaSuara = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Minta izin notifikasi juga saat tombol diklik
    if ("Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
    }

    try {
      audio.muted = true;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;

      setSuaraTersedia(true);
      setTampilkanTombolSuara(false);
      localStorage.setItem("nurse_audio_unlocked", "true");

      const adaYangMenunggu = calls.some((c: any) => c.status === "PENDING");
      if (adaYangMenunggu) {
        await audio.play();
        setBerbunyi(true);
      }
    } catch (err) {
      setTampilkanTombolSuara(true);
    }
  };

  return { tampilkanTombolSuara, bukaSuara };
}
