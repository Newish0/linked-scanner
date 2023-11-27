import { useAppSettings } from "@atoms/appsettings";

import DeviceCard from "@components/DeviceCard";
import PageContainer from "@components/Page/Container";
// import PageHeader from "@components/Page/Header";
import PageSection from "@components/Page/Section";
import { ScanMode } from "@type/scan";
import { Link } from "react-router-dom";

function Home() {
    const [appSettings] = useAppSettings();

    return (
        <PageContainer>
            {/* <PageSection>
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl font-bold">Your ID</h1>
                    <IDInput disabled={true} />
                </div>
            </PageSection> */}

            <PageSection>
                {appSettings.linkedDevices.length ? (
                    <>
                        <h1 className="text-2xl font-bold">Linked devices</h1>
                        <div>
                            {appSettings.linkedDevices.map((device) => (
                                <DeviceCard savedDevice={device} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="hero bg-base-200">
                        <div className="hero-content text-center">
                            <div className="max-w-md">
                                <h1 className="text-5xl font-bold">Hello there</h1>
                                <p className="py-6">
                                    You currently do not have any linked devices. Connect to a
                                    device to begin.
                                </p>

                                <Link to="/scan" state={{ mode: ScanMode.NewDevice }}>
                                    <button className="btn btn-primary">Get Started</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </PageSection>
        </PageContainer>
    );
}

export default Home;
