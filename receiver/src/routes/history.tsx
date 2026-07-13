import { createFileRoute } from "@tanstack/solid-router";
import { HistoryList } from "core/components/history-list";

export const Route = createFileRoute("/history")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div class="p-4">
            <HistoryList />
        </div>
    );
}
