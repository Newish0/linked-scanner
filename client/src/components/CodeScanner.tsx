import { useEffect, useState } from "react";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode/esm/core";

interface CodeScannerProps {
    cameraId: string;
    config?: Html5QrcodeCameraScanConfig;
    qrCodeSuccessCallback: QrcodeSuccessCallback;
    qrCodeErrorCallback: QrcodeErrorCallback;
    onStartError: (error: unknown) => void;
}

export default function CodeScanner({
    cameraId,
    config,
    qrCodeErrorCallback,
    qrCodeSuccessCallback,
    onStartError: handleStartError,
}: CodeScannerProps) {
    const [containerId] = useState(crypto.randomUUID());

    useEffect(() => {
        let html5Qrcode: Html5Qrcode;
        let startPromise: Promise<null>;

        const init = async () => {
            html5Qrcode = new Html5Qrcode(containerId, false);

            try {
                startPromise = html5Qrcode.start(
                    cameraId,
                    config,
                    qrCodeSuccessCallback,
                    qrCodeErrorCallback
                );
                await startPromise;
            } catch (error) {
                console.error(error);
                handleStartError(error);
            }
        };

        init();

        return () => {
            startPromise
                .then(() => html5Qrcode?.stop())
                .catch(() => {
                    /** empty */
                });
        };
    }, [
        cameraId,
        config,
        containerId,
        handleStartError,
        qrCodeErrorCallback,
        qrCodeSuccessCallback,
    ]);

    return (
        <div>
            {/* Scanner Element  */}
            <div id={containerId} />
        </div>
    );
}

CodeScanner;
