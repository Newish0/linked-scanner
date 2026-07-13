import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { IconPlus } from "@tabler/icons-solidjs";
import { connections, isConnected } from "core/stores/peer-connection";
import { ConnectionQRCard } from "@/components/connection-qr-card";
import { ConnectionCard } from "@/components/connection-card";
import { Modal } from "@/components/modal";

export const Route = createFileRoute("/scanners")({
    component: RouteComponent,
});

function RouteComponent() {
    const [modalOpen, setModalOpen] = createSignal(false);

    return (
        <div class="p-4 space-y-4">
            <Show
                when={isConnected()}
                fallback={
                    <div class="card bg-base-200">
                        <div class="card-body">
                            <ConnectionQRCard />
                        </div>
                    </div>
                }
            >
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-bold">
                        Connected devices
                    </h2>
                    <button class="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                        <IconPlus class="size-4" />
                        Add device
                    </button>
                </div>

                <div class="space-y-2">
                    <For each={connections()}>{(conn) => <ConnectionCard conn={conn} />}</For>
                </div>
            </Show>

            <Modal open={modalOpen()} onClose={() => setModalOpen(false)} title="Link new device">
                <ConnectionQRCard />
            </Modal>
        </div>
    );
}
