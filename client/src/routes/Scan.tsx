import { useAppSettings } from "@atoms/appsettings";
import { selfPeerAtom } from "@atoms/peer";
import CodeScanner from "@components/CodeScanner";
import PageSection from "@components/Page/Section";
import ResponsiveModal from "@components/ResponsiveModal";
import { useCameraList } from "@hooks/html5qrcode";
import { IconAlertCircle } from "@tabler/icons-react";
import { ScanMode } from "@type/scan";
import { CameraDevice, Html5QrcodeResult } from "html5-qrcode";
import { Html5QrcodeError } from "html5-qrcode/esm/core";

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Scan() {
    const [appSettings, setAppSettings] = useAppSettings();
    const { state } = useLocation();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { cameras, hasError: hasCamPermissionError } = useCameraList();
    const [camera, setCamera] = useState<CameraDevice>();
    const [hasStartError, setStartError] = useState(false);
    const [containerAspectRatio, setContainerAspectRatio] = useState<number>();



    // Set last used camera if saved
    useEffect(() => {
        const lastUsedCamera = cameras?.find((cam) => cam.id === appSettings.lastUsedCameraId);
        setCamera(lastUsedCamera);
    }, [appSettings.lastUsedCameraId, cameras]);

    useEffect(() => {
        const container = containerRef.current;
        const updateContainerAspectRatio = () => {
            const rect = container?.getBoundingClientRect();
            if (rect) setContainerAspectRatio(rect.width / rect.height);
        };

        // Set initial container aspect ratio
        updateContainerAspectRatio();

        // Sync container aspect ratio
        container?.addEventListener("resize", updateContainerAspectRatio);

        return () => {
            container?.removeEventListener("resize", updateContainerAspectRatio);
        };
    }, []);

    const handleCameraChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const id = evt.target.value;
        const selectedCam = cameras?.find((cam) => cam.id === id);
        setCamera(selectedCam);
        setAppSettings({ ...appSettings, lastUsedCameraId: selectedCam?.id ?? null });
    };

    return (
        <>
            <div className="h-full relative" ref={containerRef}>
                <div className="absolute z-10 w-full">
                    <select
                        className="select w-full select-ghost rounded-none outline-none border-none bg-transparent"
                        onChange={handleCameraChange}
                        value={camera?.id}
                    >
                        {cameras?.map((camera) => (
                            <option key={camera.id} value={camera.id}>
                                {camera.label}
                            </option>
                        ))}
                    </select>
                </div>

                {camera && (
                    <CodeScanner
                        cameraId={camera.id}
                        config={{
                            fps: 10,
                            aspectRatio: containerAspectRatio,
                            qrbox: { width: 100, height: 100 },
                        }}
                        qrCodeSuccessCallback={(decodedText: string, result: Html5QrcodeResult) => {
                            console.log(decodedText, result);
                        }}
                        qrCodeErrorCallback={(errorMessage: string, error: Html5QrcodeError) => {
                            console.log(errorMessage, error);
                        }}
                        onStartError={() => {
                            setStartError(true);
                        }}
                    />
                )}

                {hasStartError || (hasCamPermissionError && <CamErrorSection />)}
            </div>

            {state?.mode === ScanMode.NewDevice && (
                <ResponsiveModal isOpen={true} title="Quick Start">
                    Click <code>Link Device</code> on your desktop app and scan the QR code to link
                    phone as a scanner.
                </ResponsiveModal>
            )}
        </>
    );
}

function CamErrorSection() {
    const reloadPage = () => {
        window.location.reload();
    };
    return (
        <PageSection>
            <div role="alert" className="alert alert-error">
                <IconAlertCircle />
                <span>Failed to start camera. Please check camera permissions.</span>

                <div>
                    <button className="btn btn-sm btn-neutral" onClick={reloadPage}>
                        Try Again
                    </button>
                </div>
            </div>
        </PageSection>
    );
}
