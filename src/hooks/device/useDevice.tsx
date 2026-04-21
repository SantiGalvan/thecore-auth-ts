import { useMemo } from "react";
import { UAParser } from "ua-parser-js";

export interface DeviceInfo {
    type: string;
    os: string | undefined;
    browser: string | undefined;
    vendor: string | null | undefined;
    model: string | null | undefined;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isIPhone: boolean;
    isIPad: boolean;
    isAndroid: boolean;
}

let cachedDevice: DeviceInfo | null = null;

const getDevice = (): DeviceInfo => {
    if (cachedDevice) return cachedDevice;

    const parser = new UAParser();
    const result = parser.getResult();
    const { device, os, browser } = result;

    const isIPad =
        device.model === "iPad" ||
        (/iPad/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && "ontouchend" in document));

    cachedDevice = {
        type: device.type || (isIPad ? "tablet" : "desktop"),
        os: os.name,
        browser: browser.name,
        vendor: device.vendor || null,
        model: device.model || (isIPad ? "iPad" : null),
        isMobile: device.type === "mobile",
        isTablet: device.type === "tablet" || isIPad,
        isDesktop: !device.type && !isIPad,
        isIPhone: device.model === "iPhone",
        isIPad: isIPad,
        isAndroid: os.name === "Android",
    };

    return cachedDevice;
};

const useDevice = (): DeviceInfo => useMemo(() => getDevice(), []);

export { useDevice };
