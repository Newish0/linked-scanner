// useCamera.ts
import { useEffect, useRef } from "react";

type UseCameraProps = {
    cameraId?: string;
    idealWidth?: number;
    idealHeight?: number;
    aspectRatio?: number;
    filter?: string;
};

type UseCameraResult = {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
};

const useCamera = ({
    cameraId,
    idealWidth = 720,
    idealHeight = 1280,
    aspectRatio = 16 / 9,
    filter = "contrast(500%)",
}: UseCameraProps = {}): UseCameraResult => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let mediaStream: MediaStream;
        const initCamera = async () => {
            try {
                const constraints: MediaStreamConstraints = {
                    video: {
                        deviceId: cameraId,
                        width: { ideal: idealWidth },
                        height: { ideal: idealHeight },
                        aspectRatio: { exact: aspectRatio },
                        facingMode: { ideal: "environment" },
                    },
                };

                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        };

        initCamera();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [cameraId, aspectRatio, idealHeight, idealWidth]);

    useEffect(() => {
        const drawOnCanvas = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video && canvas && video.videoWidth && video.videoHeight) {
                if (video.videoWidth !== canvas.width) canvas.width = video.videoWidth;
                if (video.videoHeight !== canvas.height) canvas.height = video.videoHeight;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.filter = filter;
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            }

            requestAnimationFrame(drawOnCanvas);
        };

        drawOnCanvas();
    }, [filter]);

    return { videoRef, canvasRef };
};

export default useCamera;
