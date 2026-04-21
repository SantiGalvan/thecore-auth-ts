import { useEffect, useState } from "react";

interface ViewportHeightOptions {
    getValues?: boolean;
}

interface ViewportHeightResult {
    height: number;
    vh: number;
}

const useViewportHeight = (options: ViewportHeightOptions = {}): ViewportHeightResult | null => {
    const { getValues = false } = options;
    const [viewportHeight, setViewportHeight] = useState(0);

    const setHeight = () => {
        const height = window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;
        const vh = height * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        if (getValues) {
            setViewportHeight(height);
        }
    };

    useEffect(() => {
        setHeight();
        window.addEventListener('resize', setHeight);
        window.addEventListener('orientationchange', setHeight);
        return () => {
            window.removeEventListener('resize', setHeight);
            window.removeEventListener('orientationchange', setHeight);
        };
    }, [getValues]);

    if (getValues) {
        return { height: viewportHeight, vh: viewportHeight * 0.01 };
    }
    return null;
};

export { useViewportHeight };
