import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode/esm/core";
import useCamera from "@hooks/useCamera";
import { twMerge } from "tailwind-merge";

interface CodeScannerProps {
    cameraId: string;
    onQRCodeScan: (result: Html5QrcodeResult) => void;
    showFilter: boolean;
    fps: number;
}

export default function CodeScanner({ cameraId, onQRCodeScan, showFilter, fps }: CodeScannerProps) {
    const [containerId] = useState(crypto.randomUUID());

    const { videoRef, canvasRef } = useCamera({
        cameraId,
        idealWidth: undefined,
        idealHeight: 1920,
        filter: "contrast(250%) brightness(75%)",
    });

    useEffect(() => {
        let scanInterval: NodeJS.Timeout;
        const init = async () => {
            const html5Qrcode = new Html5Qrcode(containerId, false);

            const scanForQR = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    try {
                        const result = await html5Qrcode.scanFileV2(
                            new File([blob], "canvasSnapshot")
                        );
                        onQRCodeScan(result);
                    } catch (error) {
                        /* empty */
                    }
                });
            };

            scanInterval = setInterval(scanForQR, (1 / fps) * 1000);
        };

        init();

        return () => {
            clearInterval(scanInterval);
        };
    }, [canvasRef, containerId, fps, onQRCodeScan]);

    return (
        <div className="h-full">
            <div className="relative h-full">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={twMerge(
                        "absolute w-full h-full object-cover",
                        showFilter ? "invisible" : "visible"
                    )}
                />
                <canvas
                    ref={canvasRef}
                    className={twMerge(
                        "absolute w-full h-full object-cover",
                        showFilter ? "visible" : "invisible"
                    )}
                />
            </div>

            {/* Scanner Element  */}
            <div id={containerId} hidden />
        </div>
    );
}

CodeScanner.defaultProps = {
    showFilter: false,
    fps: 10,
};
