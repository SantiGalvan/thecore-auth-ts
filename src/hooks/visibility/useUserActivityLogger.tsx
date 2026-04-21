import { useEffect } from "react";

export function useUserActivityLogger(): void {
    const handleVisibility = () => console.log("[visibilitychange]", document.visibilityState);
    const handleFocus = () => console.log("[focus] La finestra ha il focus");
    const handleBlur = () => console.log("[blur] La finestra ha perso il focus");
    const handlePageshow = (event: PageTransitionEvent) =>
        console.log("[pageshow] Pagina mostrata, persisted:", event.persisted);
    const handlePagehide = (event: PageTransitionEvent) =>
        console.log("[pagehide] Pagina nascosta o abbandonata, persisted:", event.persisted);

    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("pageshow", handlePageshow);
        window.addEventListener("pagehide", handlePagehide);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("pageshow", handlePageshow);
            window.removeEventListener("pagehide", handlePagehide);
        };
    }, []);
}
