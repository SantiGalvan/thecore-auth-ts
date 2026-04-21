import { useEffect, useState, useMemo } from "react";

export interface UserActivityResult {
    visibilityState: DocumentVisibilityState;
    isVisible: boolean;
    isHidden: boolean;
    hasFocus: boolean;
    isActive: boolean;
    isFromBFCache: boolean;
    isPageHidden: boolean;
}

export function useUserActivity(): UserActivityResult {
    const [visibilityState, setVisibilityState] = useState<DocumentVisibilityState>(document.visibilityState);
    const [hasFocus, setHasFocus] = useState(document.hasFocus());
    const [isFromBFCache, setIsFromBFCache] = useState(false);
    const [isPageHidden, setIsPageHidden] = useState(false);

    const handleVisibility = () => setVisibilityState(document.visibilityState);
    const handleFocus = () => setHasFocus(true);
    const handleBlur = () => setHasFocus(false);
    const handlePageshow = (e: PageTransitionEvent) => {
        setIsFromBFCache(e.persisted);
        setIsPageHidden(false);
    };
    const handlePagehide = () => setIsPageHidden(true);

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

    const isActive = useMemo(() => visibilityState === "visible" && hasFocus, [visibilityState, hasFocus]);

    return {
        visibilityState,
        isVisible: visibilityState === "visible",
        isHidden: visibilityState === "hidden",
        hasFocus,
        isActive,
        isFromBFCache,
        isPageHidden,
    };
}
