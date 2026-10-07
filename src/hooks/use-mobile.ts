import * as React from "react";

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Inisialisasi langsung agar tidak bernilai undefined di render pertama
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Gunakan event listener modern
    mql.addEventListener("change", onChange);

    // Sinkronisasi nilai terkini
    setIsMobile(mql.matches);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
