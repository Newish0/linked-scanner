import AboutApp from "core/components/about-app";
import ResetApp from "core/components/reset-app";
import { Settings, type SettingSection } from "core/components/settings";
import { deviceName, deviceId, setDeviceName } from "core/stores/device";
import { maxHistoryLength, setMaxHistoryLength } from "core/stores/history";

export default function ReceiverSettings() {
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
                    render: () => (
                        <AboutApp
                            appName="Linked Scanner"
                            appSuperName="receiver"
                            shortDescription="Receive barcode scans on your desktop"
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
