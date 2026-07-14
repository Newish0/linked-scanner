import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

export const [doneOnboarding, setDoneOnboarding] = makePersisted(createSignal(false), {
    name: "doneOnboarding",
});
