import { CameraDevice, Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";

export function useCameraList() {
    const [cameras, setCameras] = useState<CameraDevice[] | null>(null);
    const [hasError, setError] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                setCameras(await Html5Qrcode.getCameras());
            } catch (error) {
                setError(true);
            }
        };

        init();
    }, []);

    return { cameras, hasError } as const;
}
