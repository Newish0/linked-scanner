export default function AboutApp({ version, logo }: { version: string; logo: string }) {
    return (
        <>
            <div className="flex items-center gap-2">
                <img src={logo} className="w-16" />
                <div>
                    <h1 className="text-primary text-2xl">
                        Linked Scanner
                        <sup className="text-xs ml-1">host</sup>
                    </h1>
                    <p className="text-xs">Unleash your phone into a barcode scanner</p>
                </div>
            </div>

            <div className="text-xs ml-16 pl-2">
                <div>
                    <span>Version: {version}</span>
                </div>
                <div>
                    <span>License: </span>
                    <a
                        className="link link-primary"
                        href="https://github.com/Newish0/linked-scanner/blob/main/LICENSE"
                        target="_blank"
                    >
                        MIT
                    </a>
                </div>
                <div>
                    <span>Github: </span>
                    <a
                        className="link link-primary"
                        href="https://github.com/newish0/linked-scanner"
                        target="_blank"
                    >
                        github.com/newish0/linked-scanner
                    </a>
                </div>
            </div>
        </>
    );
}
