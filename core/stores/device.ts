import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { nameFromId } from "../utils/names";
import { customAlphabet } from "nanoid";

const DEVICE_ID_KEY = "deviceId";
const DEVICE_NAME_KEY = "deviceName";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 21);

const storedDeviceId = localStorage.getItem(DEVICE_ID_KEY);
const initialDeviceId = storedDeviceId ?? nanoid();
if (!storedDeviceId) localStorage.setItem(DEVICE_ID_KEY, JSON.stringify(initialDeviceId));

export const [deviceId] = makePersisted(createSignal(initialDeviceId), {
    name: DEVICE_ID_KEY,
    storage: localStorage,
});

export const [deviceName, setDeviceName] = makePersisted(createSignal(nameFromId(deviceId())), {
    name: DEVICE_NAME_KEY,
    storage: localStorage,
});
