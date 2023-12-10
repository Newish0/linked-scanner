export default function PageHeader({ children }: React.PropsWithChildren) {
    return (
        <>
            <header className="bg-base-200 p-4 sticky top-0">
                <h1 className="text-2xl font-bold">{children}</h1>
            </header>
        </>
    );
}
