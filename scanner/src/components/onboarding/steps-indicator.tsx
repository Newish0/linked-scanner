import { For } from "solid-js";

export type StepKey = "start" | "welcome" | "camera" | "install";

const LABELS: Record<StepKey, string> = {
    start: "Start",
    welcome: "Welcome",
    camera: "Camera",
    install: "Install App",
};

/**
 * `current` is the active step. Steps before it read as done (✓) -
 * step 1 is always done by construction (UI-psychology momentum: the
 * user sees progress before doing anything).
 */
export function StepsIndicator(props: { current: StepKey }) {
    const order: StepKey[] = ["start", "welcome", "camera", "install"];
    const index = (key: StepKey) => order.indexOf(key);
    const isDone = (key: StepKey) => index(key) < index(props.current);
    const isActive = (key: StepKey) => key === props.current;

    return (
        <ul class="steps w-full text-sm">
            <For each={order}>
                {(key) => (
                    <li
                        class="step"
                        classList={{
                            "step-primary": isDone(key) || isActive(key),
                        }}
                    >
                        {LABELS[key]}
                    </li>
                )}
            </For>
        </ul>
    );
}

export default StepsIndicator;
