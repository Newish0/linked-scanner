import AboutApp from "core/components/about-app";
import ResetApp from "core/components/reset-app";
import { Settings, type SettingSection } from "core/components/settings";
import { deviceName, deviceId, setDeviceName } from "core/stores/device";

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
