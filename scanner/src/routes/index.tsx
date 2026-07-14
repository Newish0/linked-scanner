import { OnboardingGuide } from "@/components/onboarding/onboarding-guide";
import { makePersisted } from "@solid-primitives/storage";
import { createFileRoute, useNavigate } from "@tanstack/solid-router";
import { createEffect, createSignal } from "solid-js";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    const [doneOnboarding, setDoneOnboarding] = makePersisted(createSignal(false), {
        name: "doneOnboarding",
    });

    const navigate = useNavigate();

    const handleDoneOnboarding = () => {
        setDoneOnboarding(true);
    };

    createEffect(() => {
        if (doneOnboarding()) {
            navigate({ to: "/scan" });
        }
    });

    return (
        <div class="fixed top-0 left-0 w-dvh h-dvh p-8">
            <OnboardingGuide onDone={handleDoneOnboarding} />
        </div>
    );
}
