import { createEffect, type JSX, Show } from "solid-js";
import { IconX } from "@tabler/icons-solidjs";

export function Modal(props: {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: JSX.Element;
}) {
    let dialogRef: HTMLDialogElement | undefined;

    createEffect(() => {
        if (props.open) {
            dialogRef?.showModal();
        } else {
            dialogRef?.close();
        }
    });

    return (
            <dialog ref={dialogRef} class="modal modal-bottom sm:modal-middle" onClose={props.onClose}>
            <div class="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        <IconX class="size-4" />
                    </button>
                </form>
                <Show when={props.title}>
                    <h3 class="font-bold text-lg mb-4">{props.title}</h3>
                </Show>
                {props.children}
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
