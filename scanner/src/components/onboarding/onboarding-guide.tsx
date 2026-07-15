import { createSignal, Match, Switch } from "solid-js";
import { StepsIndicator } from "./steps-indicator";
import { CameraStep } from "./camera-step";
import { InstallStep } from "./install-step";
import { WelcomeStep } from "./welcome-step";

type Step = "welcome" | "camera" | "install";

export function OnboardingGuide(props: { onDone: () => void }) {
    const [step, setStep] = createSignal<Step>("welcome");

    return (
        <div class="mx-auto w-full max-w-sm space-y-6 p-4">
            <StepsIndicator current={step()} />

            <Switch>
                <Match when={step() === "welcome"}>
                    <WelcomeStep onNext={() => setStep("camera")} />
                </Match>
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