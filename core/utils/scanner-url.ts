export const SCANNER_PWA_URL = `https://newish0.github.io/linked-scanner/scanner`;

export const getConnectionUrl = (deviceId: string) => `${SCANNER_PWA_URL}?id=${deviceId}`;

export const getDeviceIdFromUrl = (url: string) => {
    if (!url.startsWith(SCANNER_PWA_URL)) return null;

    const urlObj = new URL(url);
    return urlObj.searchParams.get("id") || null;
};
