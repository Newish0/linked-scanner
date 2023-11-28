import { Device } from "./device";

export type ConnectionMetadata = {
    client: Device;
    host: Device;
    openedAt: Date;
};
