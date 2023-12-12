export default function Header({
    title,
    rightAction,
}: {
    title: string;
    rightAction?: React.ReactElement<HTMLButtonElement>;
}) {
    return (
        <div className="flex justify-between m-5">
            <h1 className="text-2xl font-medium">{title}</h1>

            {rightAction}
        </div>
    );
}
