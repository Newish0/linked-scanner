import { useAppSettings } from "@atoms/appsettings";
import Alert from "@components/Alert";

import CodeScanner from "@components/CodeScanner";
import PageSection from "@components/Page/Section";
import ResponsiveModal from "@components/modals/ResponsiveModal";
import { useCameraList } from "@hooks/html5qrcode";
import { useGlobalPeer } from "@hooks/useGlobalPeer";

import { ScanMode } from "@type/scan";
import { parseURLScheme } from "@shared/utils/convert";
import { isDeviceId } from "@shared/utils/device";
import { CameraDevice, Html5QrcodeResult } from "html5-qrcode";

import { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

export default function Scan() {
    const [appSettings, setAppSettings] = useAppSettings();
    const { state } = useLocation();
    const { cameras, hasError: hasCamPermissionError } = useCameraList();
    const [camera, setCamera] = useState<CameraDevice>();
    const navigate = useNavigate();
    const { sendMessage } = useGlobalPeer({ verbose: true });

    // Set last used camera if saved
    useEffect(() => {
        const lastUsedCamera = cameras?.find((cam) => cam.id === appSettings.lastUsedCameraId);
        setCamera(lastUsedCamera);
    }, [appSettings.lastUsedCameraId, cameras]);

    const handleCameraChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const id = evt.target.value;
        const selectedCam = cameras?.find((cam) => cam.id === id);
        setCamera(selectedCam);
        setAppSettings({ ...appSettings, lastUsedCameraId: selectedCam?.id ?? null });
    };

    const handleQRCodeScan = (result: Html5QrcodeResult) => {
        console.log("SCANNED", result);
        const parsedUrlScheme = parseURLScheme(result.decodedText);

        if (parsedUrlScheme) {
            if (parsedUrlScheme.path === "/link") {
                if (parsedUrlScheme.id && isDeviceId(parsedUrlScheme.id)) {
                    console.log(parsedUrlScheme);
                    navigate({
                        pathname: `/connection/new`,
                        search: createSearchParams({
                            deviceId: parsedUrlScheme.id ?? "",
                            name: parsedUrlScheme.name ?? "",
                            token: parsedUrlScheme.token ?? "",
                        }).toString(),
                    });
                } else console.error(parsedUrlScheme.id, "is not a valid device id.");
            }
        } else {
            sendMessage({
                auth: null, // TODO
                payload: result.decodedText,
            });
        }
    };

    return (
        <>
            <div className="h-full relative">
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
                        showFilter={true}
                        onQRCodeScan={handleQRCodeScan}
                    />
                )}

                {hasCamPermissionError && <CamErrorSection />}
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
            <Alert btnText="Try again" onBtnClick={reloadPage} type="error">
                Failed to start camera. Please check camera permissions.
            </Alert>
        </PageSection>
    );
}
