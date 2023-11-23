import { DeviceId, type P2P_ID_PREFIX } from "./device";

export type PeerId = `${typeof P2P_ID_PREFIX}-${DeviceId}`;
