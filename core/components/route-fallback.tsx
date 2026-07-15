import { IconBug, IconFileOff, IconHome } from "@tabler/icons-solidjs";

export function NotFound() {
    return (
        <div class="flex h-full items-center justify-center p-4">
            <div class="card w-full max-w-sm bg-base-200 shadow-xl">
                <div class="card-body items-center text-center gap-4">
                    <IconFileOff class="size-12 text-warning" />
                    <h2 class="card-title">Page not found</h2>
                    <p class="text-base-content/70">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div class="card-actions mt-2">
                        <button
                            class="btn btn-soft btn-ghost btn-sm"
                            onClick={() => window.history.back()}
                        >
                            <IconHome class="size-4" />
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RouteError(props: { error: Error; reset: () => void }) {
    return (
        <div class="flex h-full items-center justify-center p-4">
            <div class="card w-full max-w-sm bg-base-200 shadow-xl">
                <div class="card-body items-center text-center gap-4">
                    <IconBug class="size-12 text-error" />
                    <h2 class="card-title">Something went wrong</h2>
                    <div class="alert alert-error text-sm">
                        <span>{props.error?.message || "An unexpected error occurred"}</span>
                    </div>
                    <div class="card-actions mt-2 gap-2">
                        <button
                            class="btn btn-soft btn-ghost btn-sm"
                            onClick={() => window.history.back()}
                        >
                            <IconHome class="size-4" />
                            Go back
                        </button>
                        <button class="btn btn-soft btn-primary btn-sm" onClick={props.reset}>
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
