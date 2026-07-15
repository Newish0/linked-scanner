import { HistoryList } from "core/components/history-list";
import { createFileRoute } from "@tanstack/solid-router";

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
