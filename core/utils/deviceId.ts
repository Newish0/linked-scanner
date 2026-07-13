import { nameFromId } from "./names";

export const getDeviceId = () => {
    if (!localStorage.getItem("deviceId")) localStorage.setItem("deviceId", crypto.randomUUID());
    return localStorage.getItem("deviceId")!;
};

export const getDeviceName = () => {
    if (!localStorage.getItem("deviceName"))
        localStorage.setItem("deviceName", nameFromId(getDeviceId()));
    return localStorage.getItem("deviceName")!;
};
