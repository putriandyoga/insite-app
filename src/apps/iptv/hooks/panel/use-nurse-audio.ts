import { useState, useEffect, useRef, useCallback } from "react";

interface NurseCall {
  call_id?: string;
  status: string;
  room_label?: string;
}

const AUDIO_STORAGE_KEY = "nurse_audio_unlocked";
const ALARM_PATH = "/assets/alarm.mp3";

export function useNurseAudio(calls: NurseCall[]) {
  const [suaraTersedia, setSuaraTersedia] = useState(false);
  const [berbunyi, setBerbunyi] = useState(false);
  const [tampilkanTombolSuara, setTampilkanTombolSuara] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const callsRef = useRef(calls);
  const playRequestRef = useRef(false);
  const notifiedCallsRef = useRef(new Set<string>());
  const previousPendingRef = useRef(new Set<string>());

  // Selalu gunakan data panggilan paling baru.
  callsRef.current = calls;

  // Siapkan audio satu kali.
  useEffect(() => {
    const audio = new Audio(ALARM_PATH);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const unlocked = localStorage.getItem(AUDIO_STORAGE_KEY) === "true";

    unlockedRef.current = unlocked;
    setSuaraTersedia(unlocked);
    setTampilkanTombolSuara(!unlocked);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  // Aktifkan audio lewat interaksi langsung pengguna.
  const bukaSuara = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.muted = true;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;

      unlockedRef.current = true;
      localStorage.setItem(AUDIO_STORAGE_KEY, "true");

      setSuaraTersedia(true);
      setTampilkanTombolSuara(false);

      if ("Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch {
          // Audio tetap dapat digunakan tanpa notifikasi.
        }
      }

      // Jika ada panggilan menunggu, bunyikan sekarang.
      if (callsRef.current.some((call) => call.status === "PENDING")) {
        await audio.play();
        setBerbunyi(true);
      }
    } catch (error) {
      audio.muted = false;
      setTampilkanTombolSuara(true);
      console.error("Gagal mengaktifkan suara alarm:", error);
    }
  }, []);

  // Pemantauan panggilan aktif.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let aktif = true;
    let retryTimer: number | undefined;

    const getPendingCalls = () =>
      callsRef.current.filter((call) => call.status === "PENDING");

    const putarAlarm = async () => {
      if (!aktif || !unlockedRef.current || !audio.paused) return;
      if (playRequestRef.current) return;

      playRequestRef.current = true;

      try {
        audio.muted = false;
        await audio.play();

        if (aktif) {
          setBerbunyi(true);
          setTampilkanTombolSuara(false);
        }
      } catch (error) {
        if (aktif) {
          setBerbunyi(false);
          setTampilkanTombolSuara(true);
        }

        console.warn("Alarm gagal diputar:", error);
      } finally {
        playRequestRef.current = false;
      }
    };

    const periksaPanggilan = () => {
      if (!aktif) return;

      const pendingCalls = getPendingCalls();
      const pendingIds = new Set(
        pendingCalls.map(
          (call) =>
            call.call_id ?? `${call.room_label ?? "unknown"}-${call.status}`,
        ),
      );

      if (pendingCalls.length === 0) {
        audio.pause();
        audio.currentTime = 0;
        setBerbunyi(false);
        previousPendingRef.current.clear();
        notifiedCallsRef.current.clear();
        return;
      }

      // Notifikasi untuk panggilan yang baru menjadi PENDING.
      if ("Notification" in window && Notification.permission === "granted") {
        for (const call of pendingCalls) {
          const id =
            call.call_id ?? `${call.room_label ?? "unknown"}-${call.status}`;

          if (
            !previousPendingRef.current.has(id) &&
            !notifiedCallsRef.current.has(id)
          ) {
            try {
              new Notification("Panggilan Perawat Masuk!", {
                body: `Ruangan: ${call.room_label ?? "Unknown"} membutuhkan bantuan.`,
                icon: "/favicon.svg",
                requireInteraction: true,
              });
              notifiedCallsRef.current.add(id);
            } catch (error) {
              console.warn("Notifikasi gagal:", error);
            }
          }
        }
      }

      previousPendingRef.current = pendingIds;

      // Putar jika berhenti atau belum berjalan.
      if (audio.paused) {
        void putarAlarm();
      }
    };

    const pulihkanAudio = () => {
      if (document.visibilityState === "visible" || document.hasFocus()) {
        periksaPanggilan();
      }
    };

    const handleAudioPause = () => {
      if (aktif && getPendingCalls().length > 0) {
        void putarAlarm();
      }
    };

    const handleAudioEnded = () => {
      if (aktif && getPendingCalls().length > 0) {
        audio.currentTime = 0;
        void putarAlarm();
      }
    };

    audio.addEventListener("pause", handleAudioPause);
    audio.addEventListener("ended", handleAudioEnded);

    document.addEventListener("visibilitychange", pulihkanAudio);
    window.addEventListener("focus", pulihkanAudio);
    window.addEventListener("pageshow", pulihkanAudio);

    // SSE mengubah calls; timer ini hanya mencoba memulihkan audio.
    retryTimer = window.setInterval(() => {
      periksaPanggilan();
    }, 2000);

    periksaPanggilan();

    return () => {
      aktif = false;

      if (retryTimer !== undefined) {
        window.clearInterval(retryTimer);
      }

      audio.removeEventListener("pause", handleAudioPause);
      audio.removeEventListener("ended", handleAudioEnded);

      document.removeEventListener("visibilitychange", pulihkanAudio);
      window.removeEventListener("focus", pulihkanAudio);
      window.removeEventListener("pageshow", pulihkanAudio);
    };
  }, [calls]);

  return {
    tampilkanTombolSuara,
    bukaSuara,
    berbunyi,
    suaraTersedia,
  };
}
