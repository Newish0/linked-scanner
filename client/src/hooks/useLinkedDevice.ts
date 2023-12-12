import { useAppSettings } from "@atoms/appsettings";
import { useGlobalPeer } from "./useGlobalPeer";
import { ConnectionMetadata } from "@shared/type/peer";
import { Device, DeviceId, LinkedDevice } from "@shared/type/device";
import { deviceIdToPeerId, peerIdToDeviceId } from "@shared/utils/convert";
import * as jose from "jose";
import { PeerId } from "@shared/type/general";
import { connectedDevicesAtom } from "@atoms/peer";
import { useAtom } from "jotai";

enum DeviceType {
    Host,
    Client,
}

type Options = {
    secret?: string;
};

export default function useLinkedDevice(
    thisDeviceType: DeviceType,
    { secret: curSecret }: Options = {}
) {
    const [appSettings] = useAppSettings();
    const [connectedDevices, setConnectedDevices] = useAtom(connectedDevicesAtom);

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
            }

            let existingDevice = appSettings.linkedDevices.find(({ id }) => id === deviceId);

            if (!existingDevice) {
                // TODO: Handle new device

                if (!curSecret) {
                    console.warn("No current secret provided. Disconnecting.");
                    closeConn(newConn);
                    return;
                }

                try {
                    const decodedMetadata = await jose.jwtVerify(
                        newConn.metadata,
                        new TextEncoder().encode(curSecret)
                    );
                    //TODO
                } catch (error) {}
            }

            // Verify device is still the same as last
            try {
                const decodedMetadata = await jose.jwtVerify(
                    newConn.metadata,
                    existingDevice.secret,
                    {
                        issuer: existingDevice.id,
                        audience: appSettings.thisDevice.id,
                    }
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
    } as const;
}
