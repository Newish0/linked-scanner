import { Device, LinkedDevice } from "@shared/type/device";
import { randomDeviceId } from "@shared/utils/device";
import { generateAdjNounPair } from "@shared/utils/wordGenerator";
import { atom, useAtom } from "jotai";

import pkg from "@shared/../package.json";

type AppSettings = {
    thisDevice: Device;
    linkedDevices: LinkedDevice[];
    theme: string;
    lastUsedCameraId: string | null;

    showCameraCanvas: boolean;
};

const STORAGE_KEY = `${pkg.name}-app-settings`;

const getInitialAppSettings = () => {
    // Retrieve app settings from local storage or use default values
    const settingsJSON = localStorage.getItem(STORAGE_KEY);

    const defaultSettings: AppSettings = {
        thisDevice: {
            createdAt: new Date(),
            id: randomDeviceId(),
            name: generateAdjNounPair(),
        },
        linkedDevices: [],
        theme: "night",
        lastUsedCameraId: null,
        showCameraCanvas: false,
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const resetAppSettings = () => {
        localStorage.removeItem(STORAGE_KEY);
        setAppSettings(getInitialAppSettings());
    };

    return [appSettings, setAppSettingsWithLocalStorage, resetAppSettings] as const;
};
