import { useAppSettings } from "@atoms/appsettings";
import { useGlobalPeer } from "./useGlobalPeer";
import { ConnectionMetadata } from "@shared/type/peer";
import { Device, DeviceId, LinkedDevice } from "@shared/type/device";
import { deviceIdToPeerId, peerIdToDeviceId } from "@shared/utils/convert";
import * as jose from "jose";
import { PeerId } from "@shared/type/general";
import { connectedDevicesAtom } from "@atoms/peer";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import TimeBasedSecret from "@shared/utils/TimeBasedSecret";

enum DeviceType {
    Host,
    Client,
}

export default function useLinkedDevice(thisDeviceType: DeviceType) {
    const [appSettings] = useAppSettings();
    const [connectedDevices, setConnectedDevices] = useAtom(connectedDevicesAtom);
    const [secret, setSecret] = useState<Uint8Array>(TimeBasedSecret.value);

    const {
        close: closeConn,
        connect,
        localPeer,
        sendMessage,
    } = useGlobalPeer(appSettings.thisDevice.id, {
        async handleConnection(newConn) {
            const deviceId = peerIdToDeviceId(newConn.peer as PeerId);
            if (!deviceId) {
                console.warn(
                    `Closed unexpected connection from ${newConn.peer}. Invalid peer id. `
                );
                closeConn(newConn);

                return;
            }

            let existingDevice = appSettings.linkedDevices.find(({ id }) => id === deviceId);

            // Assume new device is connecting with JWT encoded using this devices current secret.
            if (!existingDevice) {
                if (!secret) {
                    console.warn("No current secret. Disconnecting.");
                    closeConn(newConn);
                    return;
                }

                try {
                    const decodedMetadata: ConnectionMetadata = (await jose.jwtVerify(
                        newConn.metadata,
                        secret
                    )) as unknown as ConnectionMetadata;

                    // Success: is valid new connection

                    if (thisDeviceType === DeviceType.Client) {
                        existingDevice = {
                            ...decodedMetadata.host,
                            lastConnected: new Date(),
                            numConnected: 1,
                            secret: new TextDecoder().decode(secret),
                            createdAt: new Date(),
                        };
                    } else if (thisDeviceType === DeviceType.Host) {
                        existingDevice = {
                            ...decodedMetadata.client,
                            lastConnected: new Date(),
                            numConnected: 1,
                            secret: new TextDecoder().decode(secret),
                            createdAt: new Date(),
                        };
                    } else {
                        console.warn("Invalid device type. Disconnecting.");
                        closeConn(newConn);
                        return;
                    }
                } catch (error) {
                    console.warn(
                        "Failed to decode JWT metadata with current secret. Disconnecting."
                    );
                    closeConn(newConn);
                    return;
                }
            }

            // Verify device is still the same as last
            try {
                const decodedMetadata = await jose.jwtVerify(
                    newConn.metadata,
                    new TextEncoder().encode(existingDevice.secret)
                );
                console.log(decodedMetadata);

                setConnectedDevices([
                    ...connectedDevices,
                    { ...existingDevice, connection: newConn },
                ]);
            } catch (error) {
                console.warn(
                    `Closed unexpected connection from ${newConn.peer}. Invalid metadata.`
                );
                closeConn(newConn);
            }
        },
    });

    // Hook react state into time based secret
    useEffect(() => {
        const secretUpdateHandler = (newValue: Uint8Array) => {
            setSecret(newValue);
        };

        TimeBasedSecret.onUpdate(secretUpdateHandler);
        return () => {
            TimeBasedSecret.offUpdate(secretUpdateHandler);
        };
    }, []);

    const closeLink = (linkedDevice: LinkedDevice) => {
        const connIndex = connectedDevices.findIndex(({ id }) => id === linkedDevice.id);

        if (connIndex >= 0) {
            closeConn(connectedDevices[connIndex].connection);
            connectedDevices.splice(connIndex, 1);
            setConnectedDevices([...connectedDevices]);
        }
    };

    const connectToDevice = async (deviceId: DeviceId, deviceName: string, secret: string) => {
        const client: Device =
            thisDeviceType === DeviceType.Client
                ? appSettings.thisDevice
                : {
                      createdAt: new Date(),
                      id: deviceId,
                      name: deviceName,
                  };

        const host: Device =
            thisDeviceType === DeviceType.Client
                ? {
                      createdAt: new Date(),
                      id: deviceId,
                      name: deviceName,
                  }
                : appSettings.thisDevice;

        const metadata: ConnectionMetadata = {
            client,
            host,
            openedAt: new Date(),
        };

        const metadataAsJWT = await new jose.SignJWT(metadata)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setIssuer(appSettings.thisDevice.id)
            .setAudience(deviceId)
            .sign(new TextEncoder().encode(secret));

        return connect(deviceIdToPeerId(deviceId), { metadata: metadataAsJWT });
    };

    return {
        connect: connectToDevice,
        close: closeLink,
        ready: localPeer !== null,
        sendMessage,
        connectedDevices,
        secret,
    } as const;
}
