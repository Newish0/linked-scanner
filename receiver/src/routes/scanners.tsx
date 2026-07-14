import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { IconPlus } from "@tabler/icons-solidjs";
import { connections, getPeerName, isConnected } from "core/stores/peer-connection";
import { ConnectionQRCard } from "@/components/connection-qr-card";
import { ConnectionCard } from "@/components/connection-card";
import { Modal } from "core/components/modal";

export const Route = createFileRoute("/scanners")({
    component: RouteComponent,
});

const CELEBRATION_DURATION = 1500;

function RouteComponent() {
    const [modalOpen, setModalOpen] = createSignal(false);
    const [newConnectionName, setNewConnectionName] = createSignal<string | null>(null);

    let prevConnectionCount = connections().length;
    let celebrationTimer: ReturnType<typeof setTimeout> | undefined;

    // "celebrating" = we just connected and should keep showing the
    // success state (in the main view or the modal, whichever applies)
    // before switching over to the normal connected UI.
    const celebrating = () => newConnectionName() !== null;

    createEffect(() => {
        const count = connections().length;

        if (count > prevConnectionCount) {
            const newConn = connections().at(-1);
            if (newConn) {
                setNewConnectionName(getPeerName(newConn.peer) ?? null);
                clearTimeout(celebrationTimer);
                celebrationTimer = setTimeout(() => {
                    setNewConnectionName(null);
                    setModalOpen(false);
                }, CELEBRATION_DURATION);
            }
        }

        prevConnectionCount = count;
    });

    onCleanup(() => clearTimeout(celebrationTimer));

    function openAddDeviceModal() {
        setModalOpen(true);
    }

    return (
        <div class="p-4 space-y-4">
            <Show
                when={isConnected() && !celebrating()}
                fallback={
                    <div class="card bg-base-200">
                        <div class="card-body">
                            <ConnectionQRCard newConnectionName={newConnectionName()} />
                        </div>
                    </div>
                }
            >
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-bold">Connected devices</h2>
                    <button class="btn btn-primary btn-sm" onClick={openAddDeviceModal}>
                        <IconPlus class="size-4" />
                        Add device
                    </button>
                </div>

                <div class="space-y-2">
                    <For each={connections()}>{(conn) => <ConnectionCard conn={conn} />}</For>
                </div>
            </Show>

            <Modal open={modalOpen()} onClose={() => setModalOpen(false)} title="Link new device">
                <ConnectionQRCard newConnectionName={newConnectionName()} />
            </Modal>
        </div>
    );
}
