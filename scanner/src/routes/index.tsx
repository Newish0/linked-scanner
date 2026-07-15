import { OnboardingGuide } from "@/components/onboarding/onboarding-guide";
import { doneOnboarding, setDoneOnboarding } from "@/stores/onboarding";
import { createFileRoute } from "@tanstack/solid-router";

import { createEffect, on, untrack } from "solid-js";
import { z } from "zod";

const searchSchema = z.object({
    connId: z.string().optional(),
});

export const Route = createFileRoute("/")({ component: Home, validateSearch: searchSchema });

function Home() {
    const search = Route.useSearch();
    const navigate = Route.useNavigate();

    const handleDoneOnboarding = () => {
        setDoneOnboarding(true);
    };

    const onboardingRedirect = (done: boolean) => {
        if (done)
            untrack(() => {
                if (search().connId) navigate({ to: "/conn", search: { id: search().connId } });
                else navigate({ to: "/scan" });
            });
    };
    createEffect(on(doneOnboarding, onboardingRedirect));

    return (
        <div class="fixed top-0 left-0 w-dvw h-dvh z-10 bg-base-100 p-8">
            <OnboardingGuide onDone={handleDoneOnboarding} />
        </div>
    );
}
