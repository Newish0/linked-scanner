import { createFileRoute } from "@tanstack/solid-router";
import { type DataConnection, Peer } from "peerjs";
import { getDeviceId } from "../utils/deviceId";
import { createSignal, For, onMount, Show } from "solid-js";
import QRCode from "qrcode";

export const Route = createFileRoute("/scanners")({
    component: RouteComponent,
});

function RouteComponent() {
    const deviceId = getDeviceId();
    const [deviceQRCode, setDeviceQRCode] = createSignal("");
    const [connections, setConnections] = createSignal<DataConnection[]>([]);
    const isConnected = () => connections().length > 0;

    const receiver = new Peer(deviceId, {});

    receiver.on("connection", function (conn) {
        setConnections((prev) => [...prev, conn]);

        conn.on("data", function (data) {
            console.log(data);
        });

        conn.on("close", function () {
            setConnections((prev) => prev.filter((c) => c !== conn));
        });
    });

    onMount(() => {
        QRCode.toDataURL(`https://newish0.github.io/linked-scanner/scanner?id=${deviceId}`, {
            color: { dark: "#1d232a" },
        }).then(setDeviceQRCode);
    });

    return (
        <div class="p-4">
            <Show when={!isConnected()}>
                <div class="space-y-2 p-4 bg-base-200 rounded-box">
                    <h3 class="text-lg font-bold">Link new device</h3>
                    <img src={deviceQRCode()} class="mx-auto rounded-box" />
                    <p class="text-center font-medium animate-pulse">Waiting for connection</p>
                    <p class="text-center text-neutral-content">
                        Scan this QR code or visit{" "}
                        <a
                            href={`https://newish0.github.io/linked-scanner/scanner`}
                            class="link link-primary"
                        >
                            Linked Scanner
                        </a>{" "}
                        on your mobile device to connect
                    </p>
                </div>
            </Show>

            <div class="space-y-2 p-4 bg-base-200 rounded-box">
                <For each={connections()}>
                    {(conn) => (
                        <div class="space-y-2 p-4 bg-base-200 rounded-box">
                            <h3 class="text-lg font-bold">{conn.peer}</h3>
                            <p class="text-center text-neutral-content">Connected</p>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}
