import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import PageHeader from "@components/Page/Header";
import SettingsOption from "@components/Page/SettingsOption";
import { IconAbc, IconRefreshAlert } from "@tabler/icons-react";
import ResponsiveModal from "@components/modals/ResponsiveModal";
import { useState } from "react";
import { useAppSettings } from "@atoms/appsettings";
import IDInput from "@components/IDInput";

import logo from "@public/128x128.png";
import pkgJson from "@public/../package.json";
import AboutApp from "@components/AboutApp";

export default function Settings() {
    const [appSettings] = useAppSettings();

    return (
        <>
            <PageContainer>
                <PageHeader title="Settings"></PageHeader>

                <SettingSection title="Device Info">
                    <SettingsOption
                        title="Device ID"
                        description="This device's identifier."
                        icon={<IconAbc />}
                    >
                        <IDInput deviceId={appSettings.thisDevice.id} size="sm" readOnly />
                    </SettingsOption>
                </SettingSection>

                <SettingSection title="Developer">
                    <ResetAppOption />
                </SettingSection>

                <SettingSection title="About">
                    <AboutApp version={pkgJson.version} logo={logo} />
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

function ResetAppOption() {
    const [, , reset] = useAppSettings();

    const [showModal, setShowModal] = useState(false);

    const handleResetClick = () => {
        setShowModal(true);
    };

    const handleResetApp = () => {
        setShowModal(false);
        reset();
        window.location.reload();
    };

    return (
        <>
            <SettingsOption
                title="Reset App"
                icon={<IconRefreshAlert />}
                description="Deletes all data including linked device."
            >
                <button className="btn btn-error btn-outline" onClick={handleResetClick}>
                    RESET
                </button>
            </SettingsOption>

            <ResponsiveModal
                isOpen={showModal}
                title="Reset App"
                onClose={() => setShowModal(false)}
                footer={
                    <button className="btn btn-error btn-outline" onClick={handleResetApp}>
                        PROCEED
                    </button>
                }
            >
                Are you sure you want to rest the app. This will remove all settings, linked devices
                and identifiers.
            </ResponsiveModal>
        </>
    );
}
