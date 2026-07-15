import { makePersisted } from "@solid-primitives/storage";
import { IconCameraRotate } from "@tabler/icons-solidjs";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { createSignal, For, mergeProps, onCleanup, onMount, Show } from "solid-js";

interface CodeScannerProps {
    onResult: (text: string) => void;
    onError: (error: Error) => void;
    interval?: number;
    maxDecodeWidth?: number;
    contrast?: number;
    brightness?: number;
    scanRatio?: number;
}

export default function CodeScanner(props: CodeScannerProps) {
    const codeReader = new BrowserMultiFormatReader(undefined);

    const finalProps = mergeProps(
        { contrast: 100, brightness: 100, interval: 200, maxDecodeWidth: 640, scanRatio: 2 / 3 },
        props,
    );

    const [lastDeviceId, setLastDeviceId] = makePersisted(createSignal<string>(), {
        name: "lastCameraDeviceId",
        storage: localStorage,
    });
    const [devices, setDevices] = createSignal<MediaDeviceInfo[]>([]);
    const [cropRect, setCropRect] = createSignal<{
        left: number;
        top: number;
        size: number;
    } | null>(null);

    let videoRef: HTMLVideoElement | undefined;
    let canvas: HTMLCanvasElement | undefined;
    let ctx: CanvasRenderingContext2D | null = null;
    let timer: number | undefined;

    // Downscale for performance
    let busy = false;
    const tick = async () => {
        if (busy || !videoRef || !canvas || !ctx || videoRef.readyState < 2) return;
        busy = true;

        const vw = videoRef.videoWidth;
        const vh = videoRef.videoHeight;
        const container = videoRef.parentElement!;
        const cw = container.clientWidth;
        const ch = container.clientHeight;

        // ponytail: scan area = center square of viewport, ratio configurable
        const dispSize = Math.round(finalProps.scanRatio * Math.min(cw, ch));
        const dispSx = Math.round((cw - dispSize) / 2);
        const dispSy = Math.round((ch - dispSize) / 2);
        setCropRect({ left: dispSx, top: dispSy, size: dispSize });

        const s = Math.max(cw / vw, ch / vh); // object-fit:cover scale
        const videoSize = dispSize / s;

        const scale = Math.min(1, finalProps.maxDecodeWidth / videoSize);
        canvas.width = Math.round(videoSize * scale);
        canvas.height = Math.round(videoSize * scale);

        ctx.filter = `contrast(${finalProps.contrast}%) brightness(${finalProps.brightness}%)`;
        ctx.drawImage(
            videoRef,
            (vw - videoSize) / 2,
            (vh - videoSize) / 2,
            videoSize,
            videoSize,
            0,
            0,
            canvas.width,
            canvas.height,
        );
        try {
            const decodeResult = await codeReader.decodeFromCanvas(canvas);
            // appToast.info(decodeResult.getText());
            props.onResult(decodeResult.getText());
        } catch (err) {
            if (!(err instanceof NotFoundException)) {
                // appToast.error(err instanceof Error ? err.message : String(err));
                props.onError(err instanceof Error ? err : new Error(String(err)));
            }
        } finally {
            busy = false;
        }
    };

    const startStream = async (deviceId: string | null) => {
        if (timer) clearInterval(timer);
        const oldStream = videoRef?.srcObject as MediaStream | null;
        oldStream?.getTracks().forEach((t) => t.stop());

        const stream = await navigator.mediaDevices.getUserMedia({
            video: deviceId
                ? {
                      deviceId: { exact: deviceId },
                      width: { ideal: 1920 },
                      height: { ideal: 1080 },
                      frameRate: { ideal: 30 },
                  }
                : {
                      width: { ideal: 1920 },
                      height: { ideal: 1080 },
                      frameRate: { ideal: 30 },
                      facingMode: "environment",
                  },
        });
        if (videoRef) videoRef.srcObject = stream;
        timer = window.setInterval(tick, finalProps.interval);
    };

    onMount(async () => {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d", { willReadFrequently: true });
        try {
            const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
            setDevices(videoInputDevices);
            const defaultId =
                (lastDeviceId() &&
                    videoInputDevices.find((d) => d.deviceId === lastDeviceId())?.deviceId) ??
                videoInputDevices[0]?.deviceId ??
                null;
            await startStream(defaultId);
        } catch (err) {
            // appToast.error("Could not access camera devices.");
            props.onError(err instanceof Error ? err : new Error(String(err)));
        }
    });

    const handleDeviceChange = (deviceId: string) => {
        startStream(deviceId);
        setLastDeviceId(deviceId);
    };

    onCleanup(() => {
        if (timer) clearInterval(timer);
        const stream = videoRef?.srcObject as MediaStream | null;
        stream?.getTracks().forEach((t) => t.stop());
    });

    return (
        <div class="h-full relative">
            <video
                ref={videoRef}
                class="h-full w-full object-cover"
                style={{
                    filter: `contrast(${finalProps.contrast}%) brightness(${finalProps.brightness}%)`,
                }}
                muted
                autoplay
                playsinline
            />

            <Show when={cropRect()}>
                {(rect) => (
                    <div
                        class="absolute pointer-events-none z-10 rounded-box"
                        style={{
                            left: `${rect().left}px`,
                            top: `${rect().top}px`,
                            width: `${rect().size}px`,
                            height: `${rect().size}px`,
                            "box-shadow": "0 0 0 9999px rgba(0,0,0,0.5)",
                        }}
                    />
                )}
            </Show>

            <Show when={devices().length > 1}>
                <div class="fab top-20 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)]">
                    <div
                        tabindex="0"
                        role="button"
                        class="btn btn-lg btn-circle btn-primary btn-soft"
                    >
                        <IconCameraRotate />
                    </div>
                    <For each={devices()}>
                        {(device) => (
                            <button class="btn" onClick={() => handleDeviceChange(device.deviceId)}>
                                {device.label || `Camera ${device.deviceId.slice(0, 6)}`}
                            </button>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
}
