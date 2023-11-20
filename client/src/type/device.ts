export type P2PIdPrefix = "LINKED-SCANNER";

export const P2P_ID_PREFIX: P2PIdPrefix = "LINKED-SCANNER";

export type DeviceId = `${string}-${string}-${string}-${string}`;
export type DeviceParts = [string, string, string, string];

export type Device = {
    id: `${P2PIdPrefix}-${DeviceId}`;
    name: string;
    createdAt: Date;
};

export type LinkedDevice = Device & {
    lastConnected: Date;

    /** Number of times the connection to device was established  */
    numConnected: number;
};
