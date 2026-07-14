export function compressUuid(uuid: string): string {
    return btoa(
        uuid
            .replace(/-/g, "")
            .match(/../g)!
            .map((h) => String.fromCharCode(parseInt(h, 16)))
            .join(""),
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export function decompressUuid(s: string): string {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    const hex = [...bin].map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
