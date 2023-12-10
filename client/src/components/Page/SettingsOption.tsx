import { twMerge } from "tailwind-merge";

export enum SettingsOptionPosition {
    Right,
    Bottom,
}

interface SettingsOptionProps extends React.PropsWithChildren {
    title: string;
    description?: string;
    icon: React.ReactElement;
    position: SettingsOptionPosition;
    wrapTitle: boolean;
}

export default function SettingsOption({
    children,
    title,
    icon,
    description,
    position,
    wrapTitle,
}: SettingsOptionProps) {
    return (
        <div>
            <div className="flex flex-row items-center gap-4">
                <div className="text-2xl">{icon}</div>

                <div className="prose prose-sm">
                    <h3
                        className={twMerge(
                            "my-0",
                            wrapTitle ? "whitespace-normal" : "whitespace-nowrap"
                        )}
                    >
                        {title}
                    </h3>
                    <p>{description}</p>
                </div>

                {position === SettingsOptionPosition.Right && (
                    <div className="flex flex-grow justify-end items-center">{children}</div>
                )}
            </div>

            {position === SettingsOptionPosition.Bottom && (
                <>
                    <div className="divider"></div>
                    <div className="flex-grow px-4">{children}</div>
                </>
            )}
        </div>
    );
}

SettingsOption.defaultProps = {
    position: SettingsOptionPosition.Right,
    wrapTitle: false,
};
