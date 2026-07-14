import { createSignal, onMount, Show } from "solid-js";
import QRCode from "qrcode";
import { IconCheckFilled, IconQrcode } from "@tabler/icons-solidjs";
import { getConnectionUrl, SCANNER_PWA_URL } from "core/utils/scanner-url";
import { deviceId } from "core/stores/device";
import { cn } from "core/utils/tw";

type ConnectionQRCardProps = {
    newConnectionName?: string | null;
};

export function ConnectionQRCard(props: ConnectionQRCardProps) {
    const [qrCode, setQrCode] = createSignal("");

    onMount(() => {
        QRCode.toDataURL(getConnectionUrl(deviceId()), {
            color: { dark: "#1d232a", light: "#ecfaff" },
        }).then(setQrCode);
    });

    const connected = () => props.newConnectionName!!;

    return (
        <div class="space-y-3 text-center">
            <div class="hover-3d">
                <div class="relative rounded-box">
                    <div
                        class={cn(
                            "absolute w-full h-full",
                            connected() ? "bg-success" : "bg-primary animate-pulse",
                        )}
                    ></div>
                    <img
                        src={qrCode()}
                        class="relative w-48 m-1 rounded-box"
                        alt="Connection QR code"
                    />
                </div>

                {/* 8 empty divs needed for the 3D effect  */}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <Show
                when={connected()}
                fallback={
                    <>
                        <p class="font-medium animate-pulse flex items-center justify-center gap-2">
                            <IconQrcode class="size-4" />
                            Waiting for connection
                        </p>
                        <p class="text-sm text-base-content/60">
                            Scan this QR code or visit{" "}
                            <a href={SCANNER_PWA_URL} class="link link-primary">
                                Linked Scanner
                            </a>{" "}
                            on your mobile device to connect
                        </p>
                    </>
                }
            >
                <p class="font-medium flex items-center justify-center gap-2">
                    <IconCheckFilled class="size-4" />
                    Connected to {props.newConnectionName}
                </p>
            </Show>
        </div>
    );
}
