import { For, Show, Switch, Match, mergeProps, type Component, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "../utils/tw";

/**
 * Settings - SolidJS + DaisyUI + Tabler Icons
 *
 * Combines the two references this was built from:
 *  - the shadcn/React version's declarative, fully-typed `sections/settings`
 *    config API (one source of truth, no hand-rolled markup per setting)
 *  - the daisyUI/React version's icon-led row layout, where each setting can
 *    carry a leading icon and choose whether its control sits inline (to the
 *    right) or stacked (below, full width)
 *
 * Usage:
 *
 *   import { IconBell } from "@tabler/icons-solidjs";
 *   import { Settings } from "./settings";
 *
 *   <Settings
 *     sections={[
 *       {
 *         title: "Notifications",
 *         settings: [
 *           {
 *             id: "push",
 *             type: "switch",
 *             icon: IconBell,
 *             label: "Push notifications",
 *             description: "Get notified when something needs your attention.",
 *             value: pushEnabled(),
 *             onChange: setPushEnabled,
 *           },
 *         ],
 *       },
 *     ]}
 *   />
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape of a Tabler icon component (e.g. `IconBell` from @tabler/icons-solidjs). */
export type IconComponent = Component<{
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    title?: string;
    class?: string;
}>;

export type SettingType = "switch" | "input" | "select" | "slider" | "textarea" | "custom";

/**
 * How the control is positioned relative to the label:
 *  - "inline"     always a row, control beside the label, at every breakpoint
 *  - "stacked"    always a column, control below the label, at every breakpoint
 *  - "responsive" column on mobile, row from `md:` up (the old default behavior)
 * Auto-picked per type if omitted - see `defaultPosition`.
 */
export type SettingPosition = "inline" | "stacked" | "responsive";

export interface BaseSetting {
    id: string;
    label?: string;
    description?: string;
    type: SettingType;
    icon?: IconComponent;
    disabled?: boolean;
    position?: SettingPosition;
}

export interface SwitchSetting extends BaseSetting {
    type: "switch";
    value: boolean;
    onChange: (value: boolean) => void;
}

export interface InputSetting extends BaseSetting {
    type: "input";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    inputType?: "text" | "email" | "password" | "number" | "url";
    readOnly?: boolean;
}

export interface SelectSetting extends BaseSetting {
    type: "select";
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
}

export interface SliderSetting extends BaseSetting {
    type: "slider";
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    displayValue?: () => JSX.Element;
}

export interface TextareaSetting extends BaseSetting {
    type: "textarea";
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}

export interface CustomSetting extends BaseSetting {
    type: "custom";
    render: () => JSX.Element;
}

export type Setting =
    | SwitchSetting
    | InputSetting
    | SelectSetting
    | SliderSetting
    | TextareaSetting
    | CustomSetting;

export interface SettingSection {
    title: string;
    description?: string;
    disabled?: boolean;
    settings: Setting[];
}

export interface SettingsProps {
    sections: SettingSection[];
    class?: string;
    variant?: "default" | "compact";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** textarea/custom default to always-stacked; everything else defaults to responsive. */
function defaultPosition(type: SettingType): SettingPosition {
    return type === "textarea" || type === "custom" ? "stacked" : "responsive";
}

function resolvePosition(setting: Setting): SettingPosition {
    return setting.position ?? defaultPosition(setting.type);
}

/** Row layout for a given position - the only place breakpoint-gating happens. */
function rowClass(position: SettingPosition): string {
    switch (position) {
        case "inline":
            return "flex flex-row items-center justify-between gap-4";
        case "stacked":
            return "flex flex-col items-start gap-2";
        case "responsive":
            return "flex flex-col gap-2 md:flex-row md:items-center md:gap-4";
    }
}

/** Control wrapper width/shrink for a given position. */
function controlClass(position: SettingPosition): string {
    switch (position) {
        case "inline":
            return "shrink-0 grow-1 max-w-2/3 flex justify-end";
        case "stacked":
            return "w-full pl-9";
        case "responsive":
            return "w-full md:w-auto md:shrink-0";
    }
}

// ---------------------------------------------------------------------------
// Control renderer
// ---------------------------------------------------------------------------
// Each <Match> narrows `props.setting` to its concrete variant via the
// `condition && props.setting` idiom, and receives it as a typed accessor
// through the children-as-function form - no `as` casts, no IIFEs.

function SettingControl(props: { setting: Setting }) {
    return (
        <Switch>
            <Match when={props.setting.type === "switch" && props.setting}>
                {(s) => (
                    <input
                        id={s().id}
                        type="checkbox"
                        class="toggle toggle-primary"
                        checked={s().value}
                        disabled={s().disabled}
                        onChange={(e) => s().onChange(e.currentTarget.checked)}
                    />
                )}
            </Match>

            <Match when={props.setting.type === "input" && props.setting}>
                {(s) => (
                    <input
                        id={s().id}
                        type={s().inputType ?? "text"}
                        class="input w-full max-w-sm"
                        value={s().value}
                        placeholder={s().placeholder}
                        disabled={s().disabled || s().readOnly}
                        onInput={(e) => s().onChange(e.currentTarget.value)}
                    />
                )}
            </Match>

            <Match when={props.setting.type === "select" && props.setting}>
                {(s) => (
                    <select
                        id={s().id}
                        class="select w-full max-w-sm"
                        value={s().value}
                        disabled={s().disabled}
                        onChange={(e) => s().onChange(e.currentTarget.value)}
                    >
                        <Show when={s().placeholder}>
                            {(placeholder) => (
                                <option value="" disabled>
                                    {placeholder()}
                                </option>
                            )}
                        </Show>
                        <For each={s().options}>
                            {(option) => <option value={option.value}>{option.label}</option>}
                        </For>
                    </select>
                )}
            </Match>

            <Match when={props.setting.type === "slider" && props.setting}>
                {(s) => (
                    <div class="flex w-full max-w-sm items-center gap-4">
                        <input
                            id={s().id}
                            type="range"
                            class="range range-primary flex-1"
                            min={s().min}
                            max={s().max}
                            step={s().step ?? 1}
                            value={s().value}
                            disabled={s().disabled}
                            onInput={(e) => s().onChange(Number(e.currentTarget.value))}
                        />
                        <Show when={s().displayValue}>
                            <span class="w-10 shrink-0 text-right text-sm text-base-content/60">
                                {s().displayValue?.()}
                            </span>
                        </Show>
                    </div>
                )}
            </Match>

            <Match when={props.setting.type === "textarea" && props.setting}>
                {(s) => (
                    <textarea
                        id={s().id}
                        class="textarea w-full"
                        rows={s().rows ?? 4}
                        value={s().value}
                        placeholder={s().placeholder}
                        disabled={s().disabled}
                        onInput={(e) => s().onChange(e.currentTarget.value)}
                    />
                )}
            </Match>

            <Match when={props.setting.type === "custom" && props.setting}>
                {(s) => s().render()}
            </Match>
        </Switch>
    );
}

// ---------------------------------------------------------------------------
// Setting row
// ---------------------------------------------------------------------------

function SettingItem(props: { setting: Setting }) {
    const position = () => resolvePosition(props.setting);

    return (
        <div
            class={rowClass(position())}
            classList={{ "opacity-50 pointer-events-none": !!props.setting.disabled }}
        >
            <Show when={props.setting.label || props.setting.description || props.setting.icon}>
                <div class="flex flex-1 items-start gap-3">
                    <Show when={props.setting.icon}>
                        {(icon) => (
                            <span class="mt-0.5 shrink-0 text-base-content/70">
                                <Dynamic component={icon()} size={22} strokeWidth={1.75} />
                            </span>
                        )}
                    </Show>
                    <div class="space-y-0.5">
                        <label for={props.setting.id} class="text-sm font-medium leading-none">
                            {props.setting.label}
                        </label>
                        <Show when={props.setting.description}>
                            {(description) => (
                                <p class="text-sm text-base-content/60">{description()}</p>
                            )}
                        </Show>
                    </div>
                </div>
            </Show>

            <div class={cn(props.setting.type === "custom" ? "" : controlClass(position()))}>
                <SettingControl setting={props.setting} />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Section + root
// ---------------------------------------------------------------------------

function Section(props: { section: SettingSection; variant: "default" | "compact" }) {
    return (
        <div
            class="card card-border bg-base-100"
            classList={{ "opacity-50 pointer-events-none select-none": !!props.section.disabled }}
        >
            <div class="card-body gap-2">
                <div>
                    <h2 class="card-title text-lg">{props.section.title}</h2>
                    <Show when={props.section.description}>
                        {(description) => (
                            <p class="text-sm text-base-content/60">{description()}</p>
                        )}
                    </Show>
                </div>
                <div class="divider my-0" />
                <div
                    class={cn({
                        "space-y-3": props.variant === "default",
                        "space-y-1.5": props.variant === "compact",
                    })}
                >
                    <For each={props.section.settings}>
                        {(setting) => <SettingItem setting={setting} />}
                    </For>
                </div>
            </div>
        </div>
    );
}

export function Settings(rawProps: SettingsProps) {
    const props = mergeProps({ variant: "default" as const }, rawProps);

    return (
        <div class={cn("space-y-4", props.class)}>
            <For each={props.sections}>
                {(section) => <Section section={section} variant={props.variant} />}
            </For>
        </div>
    );
}

export default Settings;
