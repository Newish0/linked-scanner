import { IconDeviceMobile } from "@tabler/icons-solidjs";
import { getPeerName } from "core/stores/peer-connection";
import type { DataConnection } from "peerjs";

export function ConnectionCard(props: { conn: DataConnection }) {
    const handleDisconnect = () => {
        props.conn.close();
    };
    return (
        <div class="flex items-center gap-3 p-3 bg-base-200 rounded-box">
            <div class="bg-primary text-primary-content rounded-full p-2">
                <IconDeviceMobile class="size-5" />
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="font-bold truncate">{getPeerName(props.conn.peer) || props.conn.peer}</h3>
                <span class="badge badge-success badge-sm">Connected</span>
            </div>
            <div>
                <button class="btn btn-error btn-sm" onClick={handleDisconnect}>
                    Disconnect
                </button>
            </div>
        </div>
    );
}
