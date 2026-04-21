import { createContext, useContext, useState, ReactNode } from "react";

export type ModalType = 'submit' | 'delete' | 'custom';

export interface ModalStyle {
    width?: string;
    bgModal?: string;
    bgOverlay?: string;
    zIndex?: string;
    overlayStyle?: string;
    modalStyle?: string;
    overrideStyle?: string;
    resetButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    bgSaveButton?: string;
    bgDeleteButton?: string;
    bgResetButton?: string;
    bgCancelButton?: string;
    customButtonStyle?: string;
}

export interface ModalItem {
    name?: string;
    [key: string]: unknown;
}

interface OpenModalOptions {
    modalData?: Record<string, unknown>;
    component?: ReactNode;
    title?: string;
    onConfirm?: ((data: Record<string, unknown> | null) => void) | null;
    type?: ModalType;
    formId?: string;
    item?: ModalItem | null;
    style?: ModalStyle;
}

interface ModalContextValue {
    isOpen: boolean;
    openModal: (options?: OpenModalOptions) => void;
    closeModal: () => void;
    content: ReactNode;
    title: string;
    onConfirm: ((data: Record<string, unknown> | null) => void) | null;
    type: ModalType;
    item: ModalItem | null;
    formId: string;
    style: ModalStyle;
    modalData: Record<string, unknown> | null;
    setModalData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    headerContent: ReactNode;
    setHeaderContent: React.Dispatch<React.SetStateAction<ReactNode>>;
    footerContent: ReactNode;
    setFooterContent: React.Dispatch<React.SetStateAction<ReactNode>>;
    onCancel: (() => void) | null;
    setOnCancel: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);
    const [title, setTitle] = useState("");
    const [onConfirm, setOnConfirm] = useState<((data: Record<string, unknown> | null) => void) | null>(null);
    const [onCancel, setOnCancel] = useState<(() => void) | null>(null);
    const [item, setItem] = useState<ModalItem | null>(null);
    const [formId, setFormId] = useState("modal-form");
    const [type, setType] = useState<ModalType>("submit");
    const [style, setStyle] = useState<ModalStyle>({});
    const [modalData, setModalData] = useState<Record<string, unknown> | null>(null);
    const [headerContent, setHeaderContent] = useState<ReactNode>(null);
    const [footerContent, setFooterContent] = useState<ReactNode>(null);

    const openModal = ({
        modalData: md = {}, component = null, title: t = "",
        onConfirm: oc = null, type: tp = "submit", formId: fid = "modal-form",
        item: it = null, style: st = {}
    }: OpenModalOptions = {}) => {
        setModalData(md);
        setContent(() => component);
        setTitle(t);
        setOnConfirm(() => oc);
        setType(tp);
        setFormId(fid);
        setItem(it);
        setStyle(st);
        setIsOpen(true);
    };

    const closeModal = () => {
        setContent(null);
        setTitle("");
        setOnConfirm(null);
        setType("submit");
        setFormId("modal-form");
        setItem(null);
        setStyle({});
        setIsOpen(false);
        setModalData(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: val } = e.target;
        setModalData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onConfirm) {
            onConfirm(modalData);
            closeModal();
        }
    };

    const value: ModalContextValue = {
        isOpen, openModal, closeModal, content, title, onConfirm, type,
        item, formId, style, modalData, setModalData, handleChange, handleSubmit,
        headerContent, setHeaderContent, footerContent, setFooterContent, onCancel, setOnCancel,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

const useModal = (): ModalContextValue => {
    const value = useContext(ModalContext);
    if (value === undefined) throw new Error('Non sei all\'interno del ModalProvider');
    return value;
};

export { ModalProvider, useModal };
