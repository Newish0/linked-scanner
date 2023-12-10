import { useAppSettings } from "@atoms/appsettings";
import IDInput from "@components/IDInput";
import PageContainer from "@components/Page/Container";
import PageHeader from "@components/Page/Header";
import PageSection from "@components/Page/Section";
import SettingsOption from "@components/Page/SettingsOption";
import ResponsiveModal from "@components/modals/ResponsiveModal";
import { IconAbc, IconBug, IconRefreshAlert } from "@tabler/icons-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

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

                <SettingSection title="Scanning">
                    <ContrastOption />
                    <BrightnessOption />
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

                    <ResetAppOption />
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

function ContrastOption() {
    const [appSettings, setAppSettings] = useAppSettings();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleContrastChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setAppSettings({
            canvasFilter: {
                ...appSettings.canvasFilter,
                contrastOffset: evt.target.valueAsNumber,
            },
        });
    };

    const handleTouchStart = () => {
        setShowTooltip(true);
    };

    const handleTouchEnd = () => {
        setShowTooltip(false);
    };

    return (
        <SettingsOption
            title="Contrast"
            icon={<IconAbc />}
            description="Adjusts camera feed filter."
        >
            <div
                className={twMerge("tooltip w-full", showTooltip ? "tooltip-open" : "")}
                data-tip={appSettings.canvasFilter.contrastOffset + "%"}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <input
                    type="range"
                    min={-100}
                    max={100}
                    step={10}
                    value={appSettings.canvasFilter.contrastOffset}
                    onChange={handleContrastChange}
                    className="range range-xs range-primary"
                />
            </div>
        </SettingsOption>
    );
}

function BrightnessOption() {
    const [appSettings, setAppSettings] = useAppSettings();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleTouchStart = () => {
        setShowTooltip(true);
    };

    const handleTouchEnd = () => {
        setShowTooltip(false);
    };

    const handleBrightnessChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setAppSettings({
            canvasFilter: {
                ...appSettings.canvasFilter,
                brightnessOffset: evt.target.valueAsNumber,
            },
        });
    };
    return (
        <SettingsOption
            title="Brightness"
            icon={<IconAbc />}
            description="Adjusts camera feed filter."
        >
            <div
                className={twMerge("tooltip w-full", showTooltip ? "tooltip-open" : "")}
                data-tip={appSettings.canvasFilter.brightnessOffset + "%"}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <input
                    type="range"
                    min={-100}
                    max={100}
                    step={10}
                    value={appSettings.canvasFilter.brightnessOffset}
                    onChange={handleBrightnessChange}
                    className="range range-xs range-primary"
                />
            </div>
        </SettingsOption>
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

export default Settings;
