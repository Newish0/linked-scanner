import { makePersisted } from "@solid-primitives/storage";
import AboutApp from "core/components/about-app";
import { Settings, type SettingSection } from "core/components/settings";
import { deviceName, deviceId, setDeviceName } from "core/stores/device";
import { createSignal, onCleanup, Show, type JSX } from "solid-js";
import { clear as clearIdb } from "idb-keyval";
import { Modal } from "core/components/modal";

export default function ScannerSettings() {
    const [camContrast, setCamContrast] = makePersisted(createSignal(100), {
        name: "camContrast",
        storage: localStorage,
    });

    const [camBrightness, setCamBrightness] = makePersisted(createSignal(100), {
        name: "camBrightness",
        storage: localStorage,
    });

    const sections: SettingSection[] = [
        {
            title: "General",
            settings: [
                {
                    id: "device-name",
                    label: "Device Name",
                    type: "input",
                    value: deviceName(),
                    onChange: setDeviceName,
                },
                {
                    id: "device-id",
                    label: "Device ID",
                    type: "input",
                    readOnly: true,
                    value: deviceId(),
                    onChange: () => void {},
                },
            ],
        },
        {
            title: "Camera",
            settings: [
                {
                    id: "cam-contrast",
                    label: "Contrast",
                    type: "slider",
                    position: "inline",
                    min: 0,
                    max: 200,
                    step: 10,
                    value: camContrast(),
                    onChange: setCamContrast,
                    displayValue: () => `${camContrast()}%`,
                },
                {
                    id: "cam-brightness",
                    label: "Brightness",
                    type: "slider",
                    position: "inline",
                    min: 0,
                    max: 200,
                    step: 10,
                    value: camBrightness(),
                    onChange: setCamBrightness,
                    displayValue: () => `${camBrightness()}%`,
                },
            ],
        },
        {
            title: "Advanced",
            settings: [
                {
                    id: "reset-app",
                    label: "Reset App",
                    type: "custom",
                    position: "inline",
                    render: ResetAppSetting,
                },
            ],
        },
        {
            title: "About",
            settings: [
                {
                    id: "about",
                    type: "custom",
                    render: () => (
                        <AboutApp
                            appName="Linked Scanner"
                            appSuperName="scanner"
                            shortDescription="Unleash your phone into a barcode scanner"
                            version="0.0.1"
                            logo="logo192.png"
                            license="MIT"
                            licenseUrl="https://github.com/Newish0/linked-scanner/blob/main/LICENSE"
                            githubUrl="https://github.com/Newish0/linked-scanner"
                        />
                    ),
                },
            ],
        },
    ];

    return <Settings sections={sections} />;
}

function ResetAppSetting() {
    const [showModal, setShowModal] = createSignal(false);
    const [holding, setHolding] = createSignal(false);

    let timer: number | undefined;

    const reset = async () => {
        localStorage.clear();
        await clearIdb();
        window.location.replace(import.meta.env.BASE_URL);
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
