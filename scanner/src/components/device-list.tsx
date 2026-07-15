import { IconDeviceMobile, IconDevices2, IconPlugOff } from "@tabler/icons-solidjs";
import { connections, getPeerName, isConnected } from "core/stores/peer-connection";
import { cn } from "core/utils/tw";
import { createSignal, For, Show } from "solid-js";
import type { DataConnection } from "peerjs";
import { Modal } from "core/components/modal";

export function DeviceList() {
    const [selectedConn, setSelectedConn] = createSignal<DataConnection>();

    return (
        <>
            <div class="fab inset-y-20 left-4 flex items-start">
                <div class="indicator">
                    <span class={cn("indicator-item badge badge-sm", "badge-secondary")}>
                        {connections().length}
                    </span>
                    <div
                        tabindex="0"
                        role="button"
                        class={cn(
                            "btn btn-lg btn-circle",
                            isConnected() ? "btn-success" : "btn-warning",
                        )}
                    >
                        <IconDevices2 />
                    </div>
                </div>

                <For each={connections()}>
                    {(conn) => (
                        <button class="btn" onClick={() => setSelectedConn(conn)}>
                            {getPeerName(conn.peer) || `Device ${conn.peer.slice(0, 6)}`}
                        </button>
                    )}
                </For>
            </div>

            <Modal
                open={!!selectedConn()}
                onClose={() => setSelectedConn()}
                title={(() => {
                    const conn = selectedConn();
                    return conn ? (getPeerName(conn.peer) || `Device ${conn.peer.slice(0, 6)}`) : "";
                })()}
            >
                <Show when={selectedConn()}>
                    {(conn) => (
                        <div class="flex items-center gap-3 p-3 bg-base-200 rounded-box">
                            <div class="bg-primary text-primary-content rounded-full p-2">
                                <IconDeviceMobile class="size-5" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="font-bold truncate">{getPeerName(conn().peer) || conn().peer}</div>
                                <div class="text-xs text-base-content/60 truncate font-mono">{conn().peer}</div>
                                <span class="badge badge-success badge-sm mt-1">Connected</span>
                            </div>
                            <button
                                class="btn btn-error btn-sm btn-square"
                                onClick={() => {
                                    conn().close();
                                    setSelectedConn();
                                }}
                            >
                                <IconPlugOff class="size-4" />
                            </button>
                        </div>
                    )}
                </Show>
            </Modal>
        </>
    );
}
