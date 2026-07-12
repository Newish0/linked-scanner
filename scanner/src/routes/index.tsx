import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    return (
        <div class="p-8">
            <h1 class="text-4xl font-bold">Welcome to TanStack Start</h1>
            <p class="mt-4 text-lg">
                Edit <code>src/routes/index.tsx</code> to get started.
            </p>
            <button class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
                Button
            </button>
        </div>
    );
}
