// hooks/panel/use-nurse-audio.ts
import { useState, useEffect, useRef } from "react";

export function useNurseAudio(calls: any[]) {
  const [suaraTersedia, setSuaraTersedia] = useState<boolean>(false);
  const [berbunyi, setBerbunyi] = useState<boolean>(false);
  const [tampilkanTombolSuara, setTampilkanTombolSuara] =
    useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/assets/alarm.mp3");
    audioRef.current.loop = true;

    const handlePageShow = () => {
      if (!suaraTersedia) setTampilkanTombolSuara(true);
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [suaraTersedia]);

  useEffect(() => {
    const adaYangMenunggu = calls.some((c: any) => c.status === "PENDING");
    if (!suaraTersedia || !audioRef.current) return;

    if (adaYangMenunggu && !berbunyi) {
      audioRef.current.play().catch(() => {
        setTampilkanTombolSuara(true);
      });
      setBerbunyi(true);
    } else if (!adaYangMenunggu && berbunyi) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setBerbunyi(false);
    }
  }, [calls, suaraTersedia, berbunyi]);

  const bukaSuara = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSuaraTersedia(true);
      setTampilkanTombolSuara(false);
    } catch {
      setTampilkanTombolSuara(true);
    }
  };

  return { tampilkanTombolSuara, bukaSuara };
}
