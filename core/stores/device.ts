import { makePersisted } from "@solid-primitives/storage";
import { nameFromId } from "../utils/names";
import { createSignal } from "solid-js";

const DEVICE_ID_KEY = "deviceId";
const DEVICE_NAME_KEY = "deviceName";

const storedDeviceId = localStorage.getItem(DEVICE_ID_KEY);
const initialDeviceId = storedDeviceId ?? crypto.randomUUID();
if (!storedDeviceId) localStorage.setItem(DEVICE_ID_KEY, JSON.stringify(initialDeviceId));

export const [deviceId] = makePersisted(createSignal(initialDeviceId), {
    name: DEVICE_ID_KEY,
    storage: localStorage,
});

export const [deviceName, setDeviceName] = makePersisted(createSignal(nameFromId(deviceId())), {
    name: DEVICE_NAME_KEY,
    storage: localStorage,
});
