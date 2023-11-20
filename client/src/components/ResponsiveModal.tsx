import { useEffect, useRef } from "react";

type ModalWithFooter = {
    footer: React.ReactNode; // Replace this with the actual type of your footer
    onClose?: never;
};

type ModalWithOnClose = {
    onClose?: () => void;
    footer?: never;
};

type ResponsiveModalProps = {
    isOpen: boolean;
    title?: string;
    children?: React.ReactNode;
} & (ModalWithFooter | ModalWithOnClose);

export default function ResponsiveModal({ isOpen,title, children, ...props }: ResponsiveModalProps) {
    const modalRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    const handleClose = () => {
        if (props.onClose) props.onClose();
    };

    return (
        <>
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{title}</h3>

                    <div className="py-4">{children}</div>

                    <div className="modal-action">
                        {!props.footer && (
                            <form method="dialog">
                                <button className="btn" onClick={handleClose}>
                                    Close
                                </button>
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
