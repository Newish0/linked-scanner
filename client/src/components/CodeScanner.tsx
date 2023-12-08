import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode/esm/core";
import useCanvasCamera from "@hooks/useCanvasCamera";
import { twMerge } from "tailwind-merge";

import { createRoundedRectPath, roundedRect, fillRoundedRect } from "@shared/utils/canvas";
import {
    extractThemeColorsFromDOM,
    extractThemeUtilitiesFromDOM,
    remToPx,
} from "@shared/utils/theme";

interface CodeScannerProps {
    cameraId: string;
    onQRCodeScan: (result: Html5QrcodeResult) => void;
    showFilter: boolean;
    fps: number;
}

enum ScanStatus {
    Scanning,
    Succuss,
    Fail,
}

const CAPTURE_AREA_RATIO = 0.5;

export default function CodeScanner({ cameraId, onQRCodeScan, showFilter, fps }: CodeScannerProps) {
    const [containerId] = useState(crypto.randomUUID());
    const [screenAspectRatio, setScreenAspectRatio] = useState<number>(
        window.innerWidth / window.innerHeight
    );
    const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);

    const { videoRef, canvasRef } = useCanvasCamera({
        cameraId,
        // idealWidth: undefined,
        // idealHeight: 1920,
        aspectRatio: screenAspectRatio,
        beforeDraw(ctx) {
            // Ensure source over mode before overlay creation
            ctx.globalCompositeOperation = "source-over";

            const boxLen = Math.min(ctx.canvas.width, ctx.canvas.height) * CAPTURE_AREA_RATIO;
            const crossLen = boxLen * 0.5;
            const radius = remToPx(extractThemeUtilitiesFromDOM().roundedBox) ?? 0;

            // Create overlay frame
            ctx.save();
            if (scanStatus === ScanStatus.Scanning) {
                ctx.strokeStyle = extractThemeColorsFromDOM().primary;
            } else if (scanStatus === ScanStatus.Succuss) {
                ctx.strokeStyle = extractThemeColorsFromDOM().success;
            } else if (scanStatus === ScanStatus.Fail) {
                ctx.strokeStyle = extractThemeColorsFromDOM().error;
            } else {
                ctx.strokeStyle = extractThemeColorsFromDOM().neutralContent;
            }
            ctx.lineWidth = boxLen * 0.03;
            roundedRect(
                ctx,
                (ctx.canvas.width - boxLen) / 2,
                (ctx.canvas.height - boxLen) / 2,
                boxLen,
                boxLen,
                radius
            );
            ctx.clearRect(0, (ctx.canvas.height - crossLen) / 2, ctx.canvas.width, crossLen);
            ctx.clearRect((ctx.canvas.width - crossLen) / 2, 0, crossLen, ctx.canvas.height);
            ctx.restore();

            // Create bg overlay
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            createRoundedRectPath(
                ctx,
                (ctx.canvas.width - boxLen) / 2,
                (ctx.canvas.height - boxLen) / 2,
                boxLen,
                boxLen,
                radius
            );
            ctx.clip();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();

            // Ensure camera stream draws below overlay
            ctx.globalCompositeOperation = "destination-atop";
        },
    });

    useEffect(() => {
        const handleScreenResize = () => {
            setScreenAspectRatio(window.innerWidth / window.innerHeight);
        };

        window.addEventListener("resize", handleScreenResize);

        return () => {
            window.removeEventListener("resize", handleScreenResize);
        };
    }, []);

    useEffect(() => {
        let scanInterval: NodeJS.Timeout;

        const handleQRCodeScan = (result: Html5QrcodeResult) => {
            setScanStatus(ScanStatus.Succuss);
            onQRCodeScan(result);
        };

        const init = async () => {
            const html5Qrcode = new Html5Qrcode(containerId, false);

            const scanForQR = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const captureLen = Math.min(canvas.width, canvas.height) * CAPTURE_AREA_RATIO;
                const imageData = ctx.getImageData(
                    (canvas.width - captureLen) / 2,
                    (canvas.height - captureLen) / 2,
                    captureLen,
                    captureLen
                );

                const tmpCanvas = document.createElement("canvas");
                tmpCanvas.width = captureLen;
                tmpCanvas.height = captureLen;
                const tmpCtx = tmpCanvas.getContext("2d");
                if (!tmpCtx) return;

                // Put the pixel data onto the temporary canvas
                tmpCtx.putImageData(imageData, 0, 0);

                tmpCanvas.toBlob(async (blob) => {
                    if (!blob) return;
                    try {
                        const result = await html5Qrcode.scanFileV2(
                            new File([blob], "canvasSnapshot")
                        );
                        handleQRCodeScan(result);
                    } catch (error) {
                        handleQRCodeFail();
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

    const handleQRCodeFail = () => {};

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
