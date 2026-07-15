import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

export const [camContrast, setCamContrast] = makePersisted(createSignal(100), {
    name: "camContrast",
    storage: localStorage,
});

export const [camBrightness, setCamBrightness] = makePersisted(createSignal(100), {
    name: "camBrightness",
    storage: localStorage,
});

export const [scanRatio, setScanRatio] = makePersisted(createSignal(2 / 3), {
    name: "scanRatio",
    storage: localStorage,
});
