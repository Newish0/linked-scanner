import { createSignal, Match, Switch } from "solid-js";
import { StepsIndicator } from "./steps-indicator";
import { CameraStep } from "./camera-step";
import { InstallStep } from "./install-step";

type Step = "camera" | "install";

export function OnboardingGuide(props: { onDone: () => void }) {
    const [step, setStep] = createSignal<Step>("camera");

    return (
        <div class="mx-auto w-full max-w-sm space-y-6 p-4">
            <StepsIndicator current={step()} />

            <Switch>
                <Match when={step() === "camera"}>
                    <CameraStep onNext={() => setStep("install")} />
                </Match>
                <Match when={step() === "install"}>
                    <InstallStep onDone={props.onDone} />
                </Match>
            </Switch>
        </div>
    );
}

export default OnboardingGuide;