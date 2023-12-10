import { useAppSettings } from "@atoms/appsettings";
import IDInput from "@components/IDInput";
import PageContainer from "@components/Page/Container";
import PageHeader from "@components/Page/Header";
import PageSection from "@components/Page/Section";
import SettingsOption from "@components/Page/SettingsOption";
import { IconAbc, IconBug } from "@tabler/icons-react";

function Settings() {
    const [appSettings, setAppSettings] = useAppSettings();

    const handleCameraCanvasChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setAppSettings({ showCameraCanvas: evt.target.checked });
    };

    return (
        <>
            <PageContainer>
                <PageHeader>Settings</PageHeader>

                <SettingSection title="Device Info">
                    <SettingsOption title="Device ID" icon={<IconAbc />}>
                        <IDInput deviceId={appSettings.thisDevice.id} size="sm" readOnly />
                    </SettingsOption>
                </SettingSection>

                <SettingSection title="Developer">
                    <SettingsOption
                        title="Show Camera Pipeline"
                        icon={<IconBug />}
                        description="See both the camera stream and underlying canvas."
                    >
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={appSettings.showCameraCanvas}
                            onChange={handleCameraCanvasChange}
                        />
                    </SettingsOption>
                </SettingSection>
            </PageContainer>
        </>
    );
}

function SettingSection({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <PageSection>
            <h2 className="text-lg font-medium">{title}</h2>

            <div className="divider my-2"></div>

            {children}
        </PageSection>
    );
}

export default Settings;
