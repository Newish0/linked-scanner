import appToast from "core/components/app-toast";
import CodeScanner from "@/components/code-scanner";
import { IconDevices2 } from "@tabler/icons-solidjs";
import { createFileRoute } from "@tanstack/solid-router";
import {
    connect,
    connections,
    getPeerName,
    isConnected,
    sendScan,
} from "core/stores/peer-connection";
import { getDeviceIdFromUrl } from "core/utils/scanner-url";
import { cn } from "core/utils/tw";
import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";

export const Route = createFileRoute("/scan")({
    component: RouteComponent,
});

function RouteComponent() {
    const [camContrast] = makePersisted(createSignal(100), {
        name: "camContrast",
        storage: localStorage,
    });

    const [camBrightness] = makePersisted(createSignal(100), {
        name: "camBrightness",
        storage: localStorage,
    });

    let isConnecting = false;

    let lastScannedCode = "";
    const handleScan = async (code: string) => {
        const deviceId = getDeviceIdFromUrl(code);
        if (deviceId) {
            if (isConnecting) return;
            isConnecting = true;
            appToast.loading("Connecting to receiver...", { id: "new-connection" });
            try {
                await connect(deviceId);
                appToast.success("Connected successfully!", { id: "new-connection" });
            } catch (err) {
                appToast.error(
                    "Failed to connect receiver: " +
                        (err instanceof Error ? err.message : String(err)),
                    {
                        id: "new-connection",
                    },
                );
            } finally {
                isConnecting = false;
            }
        } else {
            // Ignore duplicate scans (until timeout ends)
            if (code === lastScannedCode) return;
            lastScannedCode = code;

            appToast.info(code, { duration: 2000 });
            sendScan(code);

            setTimeout(() => (lastScannedCode = ""), 2500);
        }
    };

    const handleError = (error: Error) => {
        appToast.error(error.message);
    };

    createEffect(async () => {
        if (!isConnected()) {
            appToast.warning("You are not connected to any receiver.", {
                id: "no-connection",
                dismissible: false,
                description: "Scan the QR code of the receiver to connect.",
                duration: 10e12,
            });
        } else {
            appToast.dismiss("no-connection");
        }
    });

    onCleanup(() => {
        appToast.dismiss("no-connection");
    });

    return (
        <div class="flex flex-col h-full">
            <CodeScanner
                onResult={handleScan}
                onError={handleError}
                brightness={camBrightness()}
                contrast={camContrast()}
            />

            <div class="fab inset-y-20 left-4 flex items-start">
                <div class="indicator">
                    <span class={cn("indicator-item badge badge-sm", "badge-secondary")}>
                        {connections().length}
                    </span>
                    <div
                        tabindex="0"
                        role="button"
                        class={cn(
                            "btn btn-lg btn-circle",
                            isConnected() ? "btn-success" : "btn-warning",
                        )}
                    >
                        <IconDevices2 />
                    </div>
                </div>

                <For each={connections()}>
                    {(conn) => (
                        <button class="btn">
                            {getPeerName(conn.peer) || `Device ${conn.peer.slice(0, 6)}`}
                        </button>
                    )}
                </For>
            </div>
        </div>
    );
}
