



export default function PageContainer({ children }: React.PropsWithChildren) {
    return (
        <>
            <div className="flex flex-col justify-center h-full">{children}</div>
        </>
    );
}
