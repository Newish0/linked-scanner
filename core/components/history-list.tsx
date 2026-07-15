import { For, Show, Switch, Match, createMemo } from "solid-js";
import {
    IconUpload,
    IconDownload,
    IconPlugConnected,
    IconPlayerPlay,
    IconRefresh,
    IconHistoryOff,
} from "@tabler/icons-solidjs";
import {
    history,
    type HistoryEntry,
    isConnectionHistory,
    isScanSentHistory,
    isScanReceivedHistory,
} from "../stores/history";
import { appToast } from "../components/app-toast";
import { connect, sendScan, getPeerName } from "../stores/peer-connection";
import { cn } from "../utils/tw";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
});

const formatTimestamp = (timestamp: number) => timeFormatter.format(new Date(timestamp));

const handleReplay = (entry: HistoryEntry & { type: "scan-sent" }) => {
    sendScan(entry.content);
};

let isReconnecting = false;

const handleReconnect = async (entry: HistoryEntry & { type: "connection" }) => {
    if (isReconnecting) return;
    isReconnecting = true;
    const label = getPeerName(entry.peerId) ?? entry.peerId;
    appToast.loading(`Reconnecting to ${label}...`, { id: "reconnect" });
    try {
        await connect(entry.peerId);
        appToast.success(`Reconnected to ${label}!`, { id: "reconnect" });
    } catch (err) {
        appToast.error(
            "Failed to reconnect: " + (err instanceof Error ? err.message : String(err)),
            { id: "reconnect" },
        );
    } finally {
        isReconnecting = false;
    }
};

function HistoryRow(props: { entry: HistoryEntry }) {
    return (
        <li class="list-row items-center">
            <Switch
                fallback={
                    <div class="bg-success text-success-content/70 flex size-10 items-center justify-center rounded-box">
                        <IconPlugConnected class="size-5" />
                    </div>
                }
            >
                <Match when={isScanSentHistory(props.entry)}>
                    <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-box">
                        <IconUpload class="size-5" />
                    </div>
                </Match>
                <Match when={isScanReceivedHistory(props.entry)}>
                    <div class="bg-secondary/10 text-secondary flex size-10 items-center justify-center rounded-box">
                        <IconDownload class="size-5" />
                    </div>
                </Match>
            </Switch>

            <div class="list-col-grow min-w-0">
                <Switch fallback={<div class="truncate">Connected to peer</div>}>
                    <Match when={isScanSentHistory(props.entry) ? props.entry : undefined}>
                        {(entry) => <div class="truncate font-medium">{entry().content}</div>}
                    </Match>
                    <Match when={isScanReceivedHistory(props.entry) ? props.entry : undefined}>
                        {(entry) => <div class="truncate font-medium">{entry().content}</div>}
                    </Match>
                    <Match when={isConnectionHistory(props.entry) ? props.entry : undefined}>
                        {(entry) => (
                            <div class="truncate">
                                Connected to{" "}
                                <span class="font-semibold">
                                    {getPeerName(entry().peerId) ?? entry().peerId}
                                </span>
                            </div>
                        )}
                    </Match>
                </Switch>

                <div class="text-xs uppercase font-semibold opacity-60 flex items-center gap-2">
                    <span>{formatTimestamp(props.entry.timestamp)}</span>
                    <Show when={isScanSentHistory(props.entry) ? props.entry : undefined}>
                        {(entry) => (
                            <span
                                class={cn("badge badge-soft badge-info badge-sm normal-case", {
                                    "badge-warning": entry().receiverIds.length === 0,
                                })}
                            >
                                <Switch fallback={<>No receiver</>}>
                                    <Match when={entry().receiverIds.length === 1}>
                                        1 receiver
                                    </Match>
                                    <Match when={entry().receiverIds.length > 1}>
                                        {entry().receiverIds.length} receivers
                                    </Match>
                                </Switch>
                            </span>
                        )}
                    </Show>
                    <Show when={isScanReceivedHistory(props.entry) ? props.entry : undefined}>
                        {(entry) => (
                            <span class="badge badge-soft badge-info badge-sm normal-case">
                                from {getPeerName(entry().scannerId) ?? entry().scannerId}
                            </span>
                        )}
                    </Show>
                </div>
            </div>

            <Show when={isScanSentHistory(props.entry) ? props.entry : undefined}>
                {(entry) => (
                    <button
                        type="button"
                        class="btn btn-square btn-ghost"
                        aria-label="Replay scan"
                        onClick={() => handleReplay(entry())}
                    >
                        <IconPlayerPlay class="size-[1.2em]" />
                    </button>
                )}
            </Show>

            <Show when={isConnectionHistory(props.entry) ? props.entry : undefined}>
                {(entry) => (
                    <button
                        type="button"
                        class="btn btn-square btn-ghost"
                        aria-label="Reconnect"
                        onClick={() => void handleReconnect(entry())}
                    >
                        <IconRefresh class="size-[1.2em]" />
                    </button>
                )}
            </Show>
        </li>
    );
}

export function HistoryList() {
    const sorted = createMemo(() => [...history()].sort((a, b) => b.timestamp - a.timestamp));

    return (
        <ul class="list bg-base-200 rounded-box shadow-md">
            <Show
                when={sorted().length > 0}
                fallback={
                    <li class="flex flex-col items-center gap-2 p-10 text-base-content/50">
                        <IconHistoryOff class="size-8" />
                        <span class="text-sm">No history yet</span>
                    </li>
                }
            >
                <For each={sorted()}>{(entry) => <HistoryRow entry={entry} />}</For>
            </Show>
        </ul>
    );
}
