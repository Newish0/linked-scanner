import {
    IconBrandChrome,
    IconBrandSafari,
    IconCheck,
    IconDeviceMobile,
    IconDotsVertical,
    IconDownload,
    IconShare,
    IconSquarePlus,
} from "@tabler/icons-solidjs";
import { type BeforeInstallPromptEvent, detectPlatform, isStandalone } from "core/utils/platform";
import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";

export function InstallStep(props: { onDone: () => void }) {
    const [installEvent, setInstallEvent] = createSignal<BeforeInstallPromptEvent | null>(null);
    const [installed, setInstalled] = createSignal(isStandalone());
    const [confirmed, setConfirmed] = createSignal(false); // manual "I've added it" ack

    const done = () => installed() || confirmed();
    const platform = () => detectPlatform(installEvent() !== null);

    const onBeforeInstall = (e: Event) => {
        e.preventDefault();
        setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    onMount(() => {
        window.addEventListener("beforeinstallprompt", onBeforeInstall);
        window.addEventListener("appinstalled", onInstalled);
    });
    onCleanup(() => {
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        window.removeEventListener("appinstalled", onInstalled);
    });

    async function requestInstall() {
        const event = installEvent();
        if (!event) return;
        await event.prompt();
        const { outcome } = await event.userChoice;
        setInstallEvent(null);
        if (outcome === "accepted") setInstalled(true);
    }

    return (
        <div class="card card-border bg-base-100">
            <div class="card-body items-center gap-2 text-center">
                <Switch>
                    <Match when={done()}>
                        <IconCheck size={40} stroke-width={1.5} class="text-success" />
                        <h2 class="card-title">You're all set</h2>
                        <p class="text-sm text-base-content/60">
                            The app is ready to use from your Home Screen.
                        </p>
                        <button class="btn btn-primary btn-block mt-3" onClick={props.onDone}>
                            Continue
                        </button>
                    </Match>

                    <Match when={platform() === "installable"}>
                        <IconBrandChrome size={40} stroke-width={1.5} />
                        <h2 class="card-title">Install the app</h2>
                        <p class="text-sm text-base-content/60">
                            Get full-screen access with no browser bars, right from your Home
                            Screen.
                        </p>
                        <button class="btn btn-primary btn-block mt-3" onClick={requestInstall}>
                            <IconDownload size={20} /> Install App
                        </button>
                        <button class="btn btn-ghost btn-block" onClick={props.onDone}>
                            Maybe later
                        </button>
                    </Match>

                    <Match when={platform() === "ios-safari"}>
                        <IconBrandSafari size={40} stroke-width={1.5} />
                        <h2 class="card-title">Add to Home Screen</h2>
                        <ol class="mt-1 w-full space-y-3 text-left text-sm">
                            <li>
                                <span class="badge badge-primary badge-sm mr-2">1</span>
                                Tap
                                <kbd class="kbd p-0 mx-1">
                                    <IconShare size={14} />
                                </kbd>
                                Share inSafari's toolbar
                            </li>
                            <li>
                                <span class="badge badge-primary badge-sm mr-2">2</span>
                                Scroll down, tap
                                <kbd class="kbd p-0 mx-1">
                                    <IconSquarePlus size={14} />
                                </kbd>
                                "Add to HomeScreen"
                            </li>
                            <li>
                                <span class="badge badge-primary badge-sm mr-2">3</span>
                                Tap "Add" in the top-right corner
                            </li>
                        </ol>
                        <button
                            class="btn btn-primary btn-block mt-3"
                            onClick={() => setConfirmed(true)}
                        >
                            I've added it
                        </button>
                        <button class="btn btn-ghost btn-block" onClick={props.onDone}>
                            Maybe later
                        </button>
                    </Match>

                    <Match when={platform() === "ios-other"}>
                        <IconBrandSafari size={40} stroke-width={1.5} />
                        <h2 class="card-title">Open in Safari to install</h2>
                        <p class="text-sm text-base-content/60">
                            On iPhone and iPad, apps can only be added to the Home Screen through
                            Safari. Open this page in Safari, then tap Share → Add to Home Screen.
                        </p>
                        <button class="btn btn-ghost btn-block mt-3" onClick={props.onDone}>
                            Continue without installing
                        </button>
                    </Match>

                    <Match when={platform() === "desktop-safari"}>
                        <IconBrandSafari size={40} stroke-width={1.5} />
                        <h2 class="card-title">Add to Dock</h2>
                        <ol class="mt-1 w-full space-y-3 text-left text-sm">
                            <li>
                                <span class="badge badge-primary badge-sm mr-2">1</span>
                                Tap
                                <kbd class="kbd p-0 mx-1">
                                    <IconShare size={14} />
                                </kbd>
                                Share in the toolbar
                            </li>
                            <li>
                                <span class="badge badge-primary badge-sm mr-2">2</span>
                                Choose "Add to Dock"
                            </li>
                        </ol>
                        <button
                            class="btn btn-primary btn-block mt-3"
                            onClick={() => setConfirmed(true)}
                        >
                            I've added it
                        </button>
                        <button class="btn btn-ghost btn-block" onClick={props.onDone}>
                            Maybe later
                        </button>
                    </Match>

                    <Match when={platform() === "other"}>
                        <IconDeviceMobile size={40} stroke-width={1.5} />
                        <h2 class="card-title">Install the app</h2>
                        <p class="text-sm text-base-content/60">
                            Open your browser menu
                            <kbd class="kbd p-0 mx-1">
                                <IconDotsVertical size={14} />
                            </kbd>
                            and choose "Install app" or "Add to Home screen".
                        </p>
                        <button
                            class="btn btn-primary btn-block mt-3"
                            onClick={() => setConfirmed(true)}
                        >
                            I've added it
                        </button>
                        <button class="btn btn-ghost btn-block" onClick={props.onDone}>
                            Maybe later
                        </button>
                    </Match>
                </Switch>
            </div>
        </div>
    );
}

export default InstallStep;
