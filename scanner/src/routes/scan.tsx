import appToast from "core/components/app-toast";
import CodeScanner from "@/components/code-scanner";
import { DeviceList } from "@/components/device-list";
import { createFileRoute } from "@tanstack/solid-router";
import { connect, isConnected, sendScan } from "core/stores/peer-connection";
import { getDeviceIdFromUrl } from "core/utils/scanner-url";
import { createEffect, onCleanup } from "solid-js";
import { camBrightness, camContrast, scanRatio } from "@/stores/scanner-settings";

export const Route = createFileRoute("/scan")({
    component: RouteComponent,
});

function RouteComponent() {
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
                scanRatio={scanRatio()}
            />

            <DeviceList />
        </div>
    );
}
