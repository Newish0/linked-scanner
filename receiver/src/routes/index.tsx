import { createFileRoute, Navigate } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    return <Navigate to="/scanners" />;
}
