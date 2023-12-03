



export default function PageContainer({ children }: React.PropsWithChildren) {
    return (
        <>
            <div className="flex flex-col justify-start h-full">{children}</div>
        </>
    );
}
