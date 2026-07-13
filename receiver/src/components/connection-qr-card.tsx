import { createSignal, onMount } from "solid-js";
import QRCode from "qrcode";
import { IconQrcode } from "@tabler/icons-solidjs";
import { getConnectionUrl, SCANNER_PWA_URL } from "core/utils/scanner-url";
import { getDeviceId } from "core/utils/deviceId";

export function ConnectionQRCard() {
    const [qrCode, setQrCode] = createSignal("");

    onMount(() => {
        QRCode.toDataURL(getConnectionUrl(getDeviceId()), {
            color: { dark: "#1d232a", light: "#ecfaff" },
        }).then(setQrCode);
    });

    return (
        <div class="space-y-3 text-center">
            <div class="hover-3d">
                <div class="relative rounded-box">
                    <div class="absolute w-full h-full bg-primary animate-pulse"></div>
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
        </div>
    );
}
