import { makePersisted } from "@solid-primitives/storage";
import AboutApp from "core/components/about-app";
import ResetApp from "core/components/reset-app";
import { Settings, type SettingSection } from "core/components/settings";
import { deviceId, deviceName, setDeviceName } from "core/stores/device";
import { maxHistoryLength, setMaxHistoryLength } from "core/stores/history";
import { createSignal } from "solid-js";

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
                    id: "history-length",
                    label: "History Length",
                    description: "Max number of entries to keep in scan history.",
                    type: "slider",
                    position: "inline",
                    min: 50,
                    max: 500,
                    step: 10,
                    value: maxHistoryLength(),
                    onChange: setMaxHistoryLength,
                    displayValue: () => `${maxHistoryLength()} entries`,
                },
                {
                    id: "reset-app",
                    label: "Reset App",
                    type: "custom",
                    position: "inline",
                    render: () => <ResetApp baseUrl={import.meta.env.BASE_URL} />,
                },
            ],
        },
        {
            title: "About",
            settings: [
                {
                    id: "about",
                    type: "custom",
                    position: "inline",
                    render: () => (
                        <AboutApp
                            appName="Linked Scanner"
                            appSuperName="scanner"
                            shortDescription="Unleash your phone into a barcode scanner"
                            version={import.meta.env.VITE_APP_VERSION}
                            logo="logoR192.png"
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
