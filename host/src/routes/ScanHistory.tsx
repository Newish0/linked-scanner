import PageContainer from "@components/Page/Container";
import PageSection from "@components/Page/Section";
import PageHeader from "@components/Page/Header";
import Accordion from "@components/Accordation";
import { IconCheck, IconCircleCheck, IconLineDashed } from "@tabler/icons-react";
export default function ScanHistory() {
    return (
        <>
            <PageContainer>
                <PageHeader title="Scan History"></PageHeader>

                <PageSection>
                    <Accordion title={"Sunny Cove"} name={"device"}>
                        <ul className="timeline timeline-vertical">
                            <li>
                                <div className="timeline-start">1984</div>
                                <div className="timeline-middle">
                                    <IconLineDashed />
                                </div>
                                <div className="timeline-end timeline-box">
                                    First Macintosh computer
                                </div>
                                <hr />
                            </li>
                        </ul>
                    </Accordion>
                </PageSection>
            </PageContainer>
        </>
    );
}
