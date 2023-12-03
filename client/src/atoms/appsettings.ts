import { Device, DeviceId, LinkedDevice } from "@shared/type/device";
import { randomDeviceId } from "@shared/utils/device";
import { generateAdjNounPair } from "@shared/utils/wordGenerator";
import { atom, useAtom } from "jotai";

type AppSettings = {
    thisDevice: Device;
    linkedDevices: LinkedDevice[];
    theme: string;
    lastUsedCameraId: string | null;
};

const getInitialAppSettings = () => {
    // Retrieve app settings from local storage or use default values
    const settingsJSON = localStorage.getItem("appSettings");

    const defaultSettings: AppSettings = {
        thisDevice: {
            createdAt: new Date(),
            id: randomDeviceId(),
            name: generateAdjNounPair(),
        },
        linkedDevices: [],
        theme: "night",
        lastUsedCameraId: null,
    };

    const settings: AppSettings = settingsJSON ? JSON.parse(settingsJSON) : defaultSettings;

    return settings;
};

/**
 * This atom is to be used/accessed using  useAppSettings
 */
const appSettingsAtom = atom<AppSettings>(getInitialAppSettings());

export const useAppSettings = () => {
    const [appSettings, setAppSettings] = useAtom(appSettingsAtom);

    // Custom setter function that updates both atom and localStorage
    const setAppSettingsWithLocalStorage = (partialSettings: Partial<AppSettings>) => {
        setAppSettings((oldSettings) => {
            const newSettings = { ...oldSettings, ...partialSettings };
            localStorage.setItem("appSettings", JSON.stringify(newSettings));
            return newSettings;
        });
    };

    return [appSettings, setAppSettingsWithLocalStorage] as const;
};
