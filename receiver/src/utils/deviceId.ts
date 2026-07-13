export const getDeviceId = () => {
    if (!localStorage.getItem("deviceId")) localStorage.setItem("deviceId", crypto.randomUUID());
    return localStorage.getItem("deviceId")!;
};
