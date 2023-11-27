import { DeviceId, DeviceParts } from "@shared/type/device";

const VALID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomDeviceId(): DeviceId {
    const sections: string[] = [];

    for (let i = 0; i < 4; i++) {
        let section = "";
        for (let j = 0; j < 4; j++) {
            const randomIndex = Math.floor(Math.random() * VALID_CHARS.length);
            section += VALID_CHARS[randomIndex];
        }
        sections.push(section);
    }

    const uniqueId: DeviceId = sections.join("-") as DeviceId;
    return uniqueId;
}

export function isDeviceId(idStr: string) {
    const parts = idStr.split("-");

    if (parts.length !== 4) return false;

    for (const part of parts) {
        if (part.length !== 4) return false;
        for (const char of part) if (!VALID_CHARS.includes(char)) return false;
    }

    return true;
}

export function toDeviceIdParts(deviceIdStr: string): null | DeviceParts {
    if (!isDeviceId(deviceIdStr)) return null;
    return deviceIdStr.split("-") as DeviceParts;
}
