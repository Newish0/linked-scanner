import CodeScanner from "@/components/code-scanner";
import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/scan")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CodeScanner />;
}
