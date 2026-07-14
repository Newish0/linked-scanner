type AboutAppProps = {
    appName: string;
    appSuperName: string;
    shortDescription: string;
    version: string;
    logo: string;
    license: string;
    licenseUrl: string;
    githubUrl: string;
};

export default function AboutApp(props: AboutAppProps) {
    const shortGhUrl = () => {
        const url = new URL(props.githubUrl);
        return url.hostname + url.pathname;
    };
    return (
        <div class="flex flex-wrap items-center">
            <div class="flex items-center gap-2 mb-1">
                <img src={props.logo} class="size-16" />
                <div>
                    <h1 class="text-primary text-2xl leading-5">
                        {props.appName}
                        <sup class="text-xs ml-1">{props.appSuperName}</sup>
                    </h1>
                    <p class="text-xs">{props.shortDescription}</p>
                </div>
            </div>

            <div class="text-xs ml-16 pl-2">
                <div>
                    <span>Version: {props.version}</span>
                </div>
                <div>
                    <span>License: </span>
                    <a class="link link-primary" href={props.licenseUrl} target="_blank">
                        {props.license}
                    </a>
                </div>
                <div>
                    <span>Github: </span>
                    <a class="link link-primary" href={props.githubUrl} target="_blank">
                        {shortGhUrl()}
                    </a>
                </div>
            </div>
        </div>
    );
}
