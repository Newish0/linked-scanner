import ScannerSettings from "@/components/scanner-settings";
import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/settings")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div class="p-4">
            <ScannerSettings />
        </div>
    );
}
