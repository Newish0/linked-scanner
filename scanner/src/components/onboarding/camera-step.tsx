import { createSignal, Match, Switch } from "solid-js";
import { IconCamera, IconCheck } from "@tabler/icons-solidjs";

type CameraStatus = "idle" | "granted" | "denied";

export function CameraStep(props: { onNext: () => void }) {
    const [status, setStatus] = createSignal<CameraStatus>("idle");

    async function requestCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop()); // only checking permission
            setStatus("granted");
        } catch {
            setStatus("denied");
        }
    }

    return (
        <div class="card card-border bg-base-100">
            <div class="card-body items-center gap-1 text-center">
                <Switch>
                    <Match when={status() === "idle"}>
                        <IconCamera size={40} stroke-width={1.5} />
                        <h2 class="card-title">Enable your camera</h2>
                        <p class="text-sm text-base-content/60">
                            We need camera access to scan things for you.
                        </p>
                        <button
                            class="btn btn-primary btn-block mt-3"
                            onClick={requestCamera}
                        >
                            Enable Camera
                        </button>
                    </Match>

                    <Match when={status() === "granted"}>
                        <IconCheck size={40} stroke-width={1.5} class="text-success" />
                        <h2 class="card-title">Camera enabled</h2>
                        <button
                            class="btn btn-primary btn-block mt-3"
                            onClick={props.onNext}
                        >
                            Continue
                        </button>
                    </Match>

                    <Match when={status() === "denied"}>
                        <IconCamera size={40} stroke-width={1.5} class="text-warning" />
                        <h2 class="card-title">Camera blocked</h2>
                        <p class="text-sm text-base-content/60">
                            Enable it in your browser settings, then retry.
                        </p>
                        <button
                            class="btn btn-primary btn-block mt-3"
                            onClick={requestCamera}
                        >
                            Retry
                        </button>
                        <button class="btn btn-ghost btn-block" onClick={props.onNext}>
                            Skip for now
                        </button>
                    </Match>
                </Switch>
            </div>
        </div>
    );
}

export default CameraStep;
