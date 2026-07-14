// 5 buckets is all the install-instructions UI needs.

export type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type Platform = "installable" | "ios-safari" | "ios-other" | "desktop-safari" | "other";

export function isIOS(): boolean {
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) // iPadOS "desktop" UA
    );
}

export function isSafari(): boolean {
    return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(navigator.userAgent);
}

export function isStandalone(): boolean {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true
    );
}

export function detectPlatform(hasInstallPrompt: boolean): Platform {
    if (isIOS()) return isSafari() ? "ios-safari" : "ios-other";
    if (hasInstallPrompt) return "installable";
    if (isSafari()) return "desktop-safari";
    return "other";
}
