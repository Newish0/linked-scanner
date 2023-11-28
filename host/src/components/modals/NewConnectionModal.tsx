import { useEffect, useRef } from "react";
import ResponsiveModal from "./ResponsiveModal";
import QRCode from "qrcode";
import { useAppSettings } from "@atoms/appsettings";
import { useGlobalPeer } from "@hooks/useGlobalPeer";

export default function NewConnectionModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [appSettings] = useAppSettings();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        QRCode.toCanvas(
            canvasRef.current,
            `linkedscanner://link?id=${appSettings.thisDevice.id}&name=${appSettings.thisDevice.name}`,
            {
                color: {
                    dark: "#000000dd",
                    light: "#ffffff00",
                },
                scale: 6,
            }
        )
            .then(() => {})
            .catch((err) => {
                console.error(err);
            });
    }, [canvasRef.current, appSettings.thisDevice.id]);

    return (
        <ResponsiveModal title="Link New Device" isOpen={isOpen} onClose={onClose}>
            <div className="space-y-2">
                <div className="rounded-box bg-slate-200 m-auto w-min">
                    <canvas ref={canvasRef}></canvas>
                </div>

                <div className="text-center animate-pulse">Waiting for connection</div>
                <div>
                    Visit
                    <a href="" className="link link-primary mx-1">
                        Linked Scanner
                    </a>
                    on your phone and scan QR Code from the web app.
                </div>
            </div>
        </ResponsiveModal>
    );
}
