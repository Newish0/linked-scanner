import { useEffect, useRef } from "react";

type ResponsiveModalProps = {
    isOpen: boolean;
    title?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    onClose?: () => void;
};

export default function ResponsiveModal({
    isOpen,
    title,
    children,
    ...props
}: ResponsiveModalProps) {
    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const handleClose = () => {
            if (props.onClose) props.onClose();
        };

        const modal = modalRef.current;
        modal?.addEventListener("close", handleClose);

        return () => {
            modal?.removeEventListener("close", handleClose);
        };
    }, [props]);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    return (
        <>
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{title}</h3>

                    <div className="py-4">{children}</div>

                    <div className="modal-action">
                        {props.footer ? (
                            props.footer
                        ) : (
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        )}
                    </div>
                </div>
            </dialog>
        </>
    );
}

ResponsiveModal.defaultProps = {
    isOpen: false,
};
