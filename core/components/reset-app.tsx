import { createSignal, onCleanup, Show, type JSX } from "solid-js";
import { clear as clearIdb } from "idb-keyval";
import { Modal } from "./modal";

type Props = {
    baseUrl: string;
};

export default function ResetApp(props: Props) {
    const [showModal, setShowModal] = createSignal(false);
    const [holding, setHolding] = createSignal(false);

    let timer: number | undefined;

    const reset = async () => {
        localStorage.clear();
        await clearIdb();
        window.location.replace(props.baseUrl);
    };

    const startHold: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (e) => {
        e.currentTarget.setPointerCapture(e.pointerId);

        setHolding(true);

        timer = window.setTimeout(() => {
            reset();
        }, 2000);
    };

    const cancelHold = () => {
        setHolding(false);

        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    };

    onCleanup(cancelHold);

    return (
        <>
            <button class="btn btn-sm btn-error" onClick={() => setShowModal(true)}>
                Reset App
            </button>

            <Modal
                open={showModal()}
                onClose={() => {
                    cancelHold();
                    setShowModal(false);
                }}
                title="Reset App"
            >
                <p>
                    Are you sure you want to <span class="text-error font-bold">reset</span> the
                    app? This is an <span class="text-error font-bold">irreversible</span> action!
                </p>

                <button
                    class="btn btn-error btn-sm mt-8 btn-outline uppercase"
                    onPointerDown={startHold}
                    onPointerUp={cancelHold}
                    onPointerLeave={cancelHold}
                    onPointerCancel={cancelHold}
                    onLostPointerCapture={cancelHold}
                >
                    <Show when={holding()} fallback="Hold to reset">
                        Keep holding...
                    </Show>
                </button>
            </Modal>
        </>
    );
}
