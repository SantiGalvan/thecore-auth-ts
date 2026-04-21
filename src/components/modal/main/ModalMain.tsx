import { ReactNode } from "react";
import { ModalItem, ModalType } from "../../../contexts/modal/ModalContext";

interface ModalMainProps {
    type?: ModalType;
    children?: ReactNode;
    item?: ModalItem | null;
    overrideStyle?: string;
}

const ModalMain = ({ type, children, item, overrideStyle }: ModalMainProps) => {
    return (
        <>
            {type !== 'delete' &&
                <main className={overrideStyle || 'my-8 max-h-[600px] overflow-y-auto overflow-x-hidden'}>
                    {children}
                </main>
            }
        </>
    );
};

export default ModalMain;
