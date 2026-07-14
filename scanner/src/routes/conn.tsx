import { doneOnboarding } from "@/stores/onboarding";
import {
    IconAlertTriangle,
    IconCircleCheck,
    IconLoader2,
    IconPlugConnectedX,
} from "@tabler/icons-solidjs";
import { createFileRoute } from "@tanstack/solid-router";
import { connect } from "core/stores/peer-connection";
import { createSignal, Match, Switch } from "solid-js";
import { z } from "zod";

const searchSchema = z.object({
    id: z.string().optional(),
});

export const Route = createFileRoute("/conn")({
    component: RouteComponent,
    validateSearch: searchSchema,
});

type ConnState =
    | { status: "idle" }
    | { status: "connecting" }
    | { status: "success" }
    | { status: "error"; message: string };

function RouteComponent() {
    const search = Route.useSearch();
    const navigate = Route.useNavigate();

    const peerId = search().id;
    const [state, setState] = createSignal<ConnState>(
        peerId ? { status: "connecting" } : { status: "idle" },
    );

    const connectToPeer = () => {
        if (!peerId) return;

        setState({ status: "connecting" });
        connect(peerId)
            .then(() => {
                setState({ status: "success" });
                setTimeout(() => navigate({ to: "/scan" }), 800);
            })
            .catch((err) =>
                setState({
                    status: "error",
                    message: err instanceof Error ? err.message : String(err),
                }),
            );
    };

    if (!doneOnboarding()) {
        navigate({ to: "/", search: { connId: peerId } });
    } else if (peerId && doneOnboarding()) {
        connectToPeer();
    }

    return (
        <div class="flex h-full items-center justify-center p-4">
            <div class="card w-full max-w-sm bg-base-200 shadow-xl">
                <div class="card-body items-center text-center gap-4">
                    <Switch>
                        <Match when={state().status === "idle"}>
                            <IconPlugConnectedX class="size-12 text-warning" />
                            <h2 class="card-title">No connection ID</h2>
                            <p class="text-base-content/70">
                                This page needs a receiver ID in the URL to connect.
                            </p>
                            <div class="card-actions mt-2">
                                <button
                                    class="btn btn-soft btn-sm btn-primary"
                                    onClick={() => navigate({ to: "/" })}
                                >
                                    Go home
                                </button>
                            </div>
                        </Match>

                        <Match when={state().status === "connecting"}>
                            <IconLoader2 class="size-12 animate-spin text-primary" />
                            <h2 class="card-title">Connecting…</h2>
                            <p class="text-base-content/70">
                                Establishing connection to receiver
                                <span class="font-mono"> {peerId}</span>.
                            </p>
                        </Match>

                        <Match when={state().status === "success"}>
                            <IconCircleCheck class="size-12 text-success" />
                            <h2 class="card-title">Connected!</h2>
                            <p class="text-base-content/70">Redirecting to scan…</p>
                        </Match>

                        <Match when={state().status === "error"}>
                            <IconAlertTriangle class="size-12 text-error" />
                            <h2 class="card-title">Connection failed</h2>
                            <div class="alert alert-error text-sm">
                                <span>
                                    {(state() as { status: "error"; message: string }).message}
                                </span>
                            </div>
                            <div class="card-actions mt-2 gap-2">
                                <button
                                    class="btn btn-soft btn-sm btn-ghost"
                                    onClick={() => navigate({ to: "/" })}
                                >
                                    Go home
                                </button>
                                <button
                                    class="btn btn-soft btn-sm btn-primary"
                                    onClick={connectToPeer}
                                >
                                    Retry
                                </button>
                            </div>
                        </Match>
                    </Switch>
                </div>
            </div>
        </div>
    );
}
