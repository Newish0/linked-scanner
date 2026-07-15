import { toast } from "solid-sonner";
import type { JSX } from "solid-js";
import {
    IconBell,
    IconCircleCheck,
    IconInfoCircle,
    IconAlertTriangle,
    IconCircleX,
    IconLoader2,
    IconX,
} from "@tabler/icons-solidjs";

type ToastVariant = "default" | "success" | "info" | "warning" | "error" | "loading";

interface ToastAction {
    label: string;
    onClick: () => void;
}

interface AppToastOptions {
    description?: string;
    duration?: number;
    id?: string | number;
    action?: ToastAction;
    dismissible?: boolean;
}

const VARIANT_ALERT_CLASS: Record<ToastVariant, string> = {
    default: "alert alert-soft",
    success: "alert alert-success alert-soft",
    info: "alert alert-info alert-soft",
    warning: "alert alert-warning alert-soft",
    error: "alert alert-error alert-soft",
    loading: "alert alert-soft",
};

const VARIANT_ICON: Record<ToastVariant, (props: { class?: string }) => JSX.Element> = {
    default: (props) => <IconBell {...props} />,
    success: (props) => <IconCircleCheck {...props} />,
    info: (props) => <IconInfoCircle {...props} />,
    warning: (props) => <IconAlertTriangle {...props} />,
    error: (props) => <IconCircleX {...props} />,
    loading: (props) => <IconLoader2 {...props} class={`${props.class ?? ""} animate-spin`} />,
};

function AlertToast(props: {
    id: string | number;
    variant: ToastVariant;
    title: string;
    description?: string;
    action?: ToastAction;
    dismissible?: boolean;
}) {
    const Icon = VARIANT_ICON[props.variant];
    const isLoading = props.variant === "loading";

    return (
        <div role="alert" class={`${VARIANT_ALERT_CLASS[props.variant]} shadow-lg w-full max-w-sm`}>
            <Icon />

            <div class="flex-1">
                <h3 class="font-bold text-sm">{props.title}</h3>
                {props.description && <div class="text-xs opacity-80">{props.description}</div>}
            </div>

            <div class="flex items-center gap-1">
                {props.action && (
                    <button
                        class="btn btn-sm btn-primary"
                        onClick={() => {
                            props.action?.onClick();
                            toast.dismiss(props.id);
                        }}
                    >
                        {props.action.label}
                    </button>
                )}
                {!isLoading && props.dismissible !== false && (
                    <button
                        class="btn btn-sm btn-ghost btn-square"
                        aria-label="Dismiss"
                        onClick={() => toast.dismiss(props.id)}
                    >
                        <IconX class="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

function show(variant: ToastVariant, title: string, options?: AppToastOptions) {
    return toast.custom(
        (id) => (
            <AlertToast
                id={id}
                variant={variant}
                title={title}
                description={options?.description}
                action={options?.action}
                dismissible={options?.dismissible}
            />
        ),
        {
            id: options?.id,
            duration: options?.duration,
        },
    );
}

interface PromiseMessages<T> {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
    description?: string;
}

function promise<T>(
    p: Promise<T>,
    messages: PromiseMessages<T>,
    options?: Omit<AppToastOptions, "id">,
) {
    const id = show("loading", messages.loading, {
        ...options,
        description: messages.description,
        dismissible: false,
    });

    p.then((data) => {
        const successMessage =
            typeof messages.success === "function" ? messages.success(data) : messages.success;
        show("success", successMessage, { ...options, id });
    }).catch((err) => {
        const errorMessage =
            typeof messages.error === "function" ? messages.error(err) : messages.error;
        show("error", errorMessage, { ...options, id });
    });

    return id;
}

export const appToast = Object.assign(
    (message: string, options?: AppToastOptions) => show("default", message, options),
    {
        success: (message: string, options?: AppToastOptions) => show("success", message, options),
        info: (message: string, options?: AppToastOptions) => show("info", message, options),
        warning: (message: string, options?: AppToastOptions) => show("warning", message, options),
        error: (message: string, options?: AppToastOptions) => show("error", message, options),
        loading: (message: string, options?: AppToastOptions) => show("loading", message, options),
        promise,
        dismiss: (id?: string | number) => toast.dismiss(id),
    },
);

export default appToast;
