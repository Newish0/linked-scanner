import { twMerge } from "tailwind-merge";

interface AccordionProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export default function Accordion({ title, subtitle, children, ...props }: AccordionProps) {
    return (
        <div
            {...props}
            className={twMerge("collapse collapse-arrow bg-base-200", props.className ?? "")}
        >
            <input type="radio" checked={true} />
            <div className="collapse-title ">
                <div className="text-xl font-medium">{title}</div>
                {subtitle && <div className="text-base font-normal">{subtitle}</div>}
            </div>
            <div className="collapse-content">{children}</div>
        </div>
    );
}
