import { OnboardingGuide } from "@/components/onboarding/onboarding-guide";
import { doneOnboarding, setDoneOnboarding } from "@/stores/onboarding";
import { createFileRoute, useNavigate } from "@tanstack/solid-router";

import { createEffect, on, untrack } from "solid-js";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    const navigate = useNavigate();

    const handleDoneOnboarding = () => {
        setDoneOnboarding(true);
    };

    const onboardingRedirect = (done: boolean) => {
        if (done) untrack(() => navigate({ to: "/scan" }));
    };
    createEffect(on(doneOnboarding, onboardingRedirect));

    return (
        <div class="fixed top-0 left-0 w-dvw h-dvh z-10 bg-base-100 p-8">
            <OnboardingGuide onDone={handleDoneOnboarding} />
        </div>
    );
}
