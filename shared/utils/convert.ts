import { URL_SCHEME_PROTOCOL } from "@shared/type/const";
import { DeviceId, P2P_ID_PREFIX } from "@shared/type/device";
import { PeerId } from "@shared/type/general";
import { isDeviceId } from "./device";

/**
 *
 */
export function parseURLScheme(url: string) {
    try {
        const parsedUrl = new URL(url);

        // Ensure protocol
        if (parsedUrl.protocol !== `${URL_SCHEME_PROTOCOL}:`) {
            return null;
        }

        // Extract path and parameters
        const path = parsedUrl.pathname.substring(1); // Remove the leading '/'
        const params = new URLSearchParams(parsedUrl.search);

        // Access the values using the get method
        const id = params.get("id");
        const token = params.get("token");

        return { path, id, token };
    } catch (error) {
        return null;
    }
}

export function deviceIdToPeerId(deviceId: DeviceId): PeerId {
    return `${P2P_ID_PREFIX}-${deviceId}`;
}

export function peerIdToDeviceId(peerId: PeerId): DeviceId | null {
    if (peerId.indexOf(P2P_ID_PREFIX) !== 0) return null;

    const maybeDeviceId = peerId.slice(P2P_ID_PREFIX.length);

    if (!isDeviceId(maybeDeviceId)) return null;

    return maybeDeviceId as DeviceId;
}
