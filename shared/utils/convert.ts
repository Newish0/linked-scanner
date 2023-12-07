import { URL_SCHEME_PROTOCOL } from "@shared/type/const";
import { DeviceId, P2P_ID_PREFIX } from "@shared/type/device";
import { PeerId } from "@shared/type/general";
import { isDeviceId } from "./device";

/**
 *
 * @param url Custom URL scheme in format `linkedscanner://action?param1=foo&param2=bar`
 * @returns
 */
export function parseURLScheme(url: string) {
    const expectedProtocol = `${URL_SCHEME_PROTOCOL}:`;
    const leadingSubstr = `${URL_SCHEME_PROTOCOL}://`;

    try {
        const parsedUrl = new URL(url);

        // Ensure protocol
        if (parsedUrl.protocol !== expectedProtocol) {
            return null;
        }

        const index = url.indexOf("?");
        const action = url.slice(leadingSubstr.length, index === -1 ? undefined : index);
        const params = new URLSearchParams(parsedUrl.search);

        // Access the values using the get method
        const id = params.get("id");
        const name = params.get("name");
        const token = params.get("token");

        return { action, id, name, token };
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
