import { useEffect, useRef, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import ModalFooter from "./footer/ModalFooter";
import ModalHeader from "./header/ModalHeader";
import ModalMain from "./main/ModalMain";
import { ModalStyle, ModalType, ModalItem } from "../../contexts/modal/ModalContext";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCancel?: (() => void) | null;
    title?: string;
    formId?: string;
    children?: ReactNode;
    item?: ModalItem | null;
    onConfirm?: ((data?: Record<string, unknown> | null) => void) | null;
    type?: ModalType;
    style?: ModalStyle;
    headerContent?: ReactNode;
    footerContent?: ReactNode;
}

const Modal = ({
    isOpen, onClose, onCancel, title, formId, children, item,
    onConfirm, type = 'submit', style = {}, headerContent, footerContent
}: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(isOpen);

    const handleTransitionEnd = () => { if (!isOpen) setShow(false); };

    const modalWidth = style.width ?? (type === 'delete' ? 'max-w-md w-auto' : 'w-full max-w-4xl');
    const bgModal = style.bgModal ?? 'bg-white';
    const bgOverlay = style.bgOverlay ?? 'bg-black/50';
    const zIndex = style.zIndex ?? "z-50";

    useEffect(() => { if (isOpen) setShow(true); }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { if (onCancel) onCancel(); else onClose(); }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose, onCancel]);

    useEffect(() => {
        if (isOpen) {
            const previouslyFocused = document.activeElement as HTMLElement | null;
            modalRef.current?.focus();
            return () => previouslyFocused?.focus();
        }
    }, [isOpen]);

    return show ? ReactDOM.createPortal(
        <div
            className={style.overlayStyle || `fixed inset-0 ${zIndex} flex items-center justify-center transition-opacity duration-200 ${isOpen ? `${bgOverlay} opacity-100` : 'opacity-0'}`}
            onClick={onCancel || onClose}
            onKeyDown={e => { if (e.key === "Escape") (onCancel || onClose)?.(); }}
            onTransitionEnd={handleTransitionEnd}
            role="button" tabIndex={0} aria-label="Chiudi modale"
        >
            <div
                ref={modalRef}
                className={style.modalStyle || `relative ${bgModal} rounded-lg p-6 shadow-xl ${modalWidth} transform transition-transform duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => { if (e.key === "Escape") onClose(); }}
                role="dialog" aria-modal="true" tabIndex={-1}
            >
                {headerContent ? headerContent : (
                    <ModalHeader onClose={onClose} onCancel={onCancel} type={type} title={title} name={item?.name} />
                )}
                <ModalMain type={type} item={item} overrideStyle={style.overrideStyle}>
                    {children}
                </ModalMain>
                {footerContent ? footerContent : (
                    <ModalFooter
                        onClose={onClose} onCancel={onCancel} onConfirm={onConfirm}
                        type={type} formId={formId} style={style}
                    />
                )}
            </div>
        </div>,
        document.body
    ) : null;
};

export default Modal;
