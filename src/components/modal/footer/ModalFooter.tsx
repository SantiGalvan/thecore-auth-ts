import { ModalStyle, ModalType } from "../../../contexts/modal/ModalContext";

interface ModalFooterProps {
    onClose: () => void;
    onConfirm?: ((data?: Record<string, unknown> | null) => void) | null;
    onCancel?: (() => void) | null;
    type?: ModalType;
    formId?: string;
    style: ModalStyle;
}

const ModalFooter = ({ onClose, onConfirm, onCancel, type = 'submit', formId, style }: ModalFooterProps) => {
    const resetButton = style.resetButton ?? true;
    const confirmButtonText = style.confirmButtonText ?? (type === 'delete' ? 'Elimina' : 'Salva');
    const cancelButtonText = style.cancelButtonText ?? 'Annulla';
    const bgSaveButton = style.bgSaveButton ?? 'bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg active:bg-indigo-800 text-white';
    const bgDeleteButton = style.bgDeleteButton ?? 'bg-rose-500 rounded-lg shadow-md hover:bg-rose-600 hover:shadow-lg active:bg-rose-700 text-white';
    const bgResetButton = style.bgResetButton ?? 'bg-rose-500 rounded-lg shadow-md hover:bg-rose-600 hover:shadow-lg active:bg-rose-700 text-white';
    const bgCancelButton = style.bgCancelButton ?? 'text-gray-800 bg-gray-300 rounded-lg shadow-md hover:bg-gray-400 hover:shadow-lg active:bg-gray-500';
    const customButtonStyle = type === 'custom' ? style.customButtonStyle : null;

    const actions: Record<string, () => void> = {
        delete: () => { onConfirm?.(); onClose?.(); },
        custom: () => { onConfirm?.(); },
    };

    return (
        <footer className="flex items-center justify-between mt-4">
            <button
                onClick={onCancel || onClose}
                className={`${bgCancelButton} px-4 py-2 cursor-pointer text-sm font-medium active:shadow-sm transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 active:opacity-70`}
            >
                {cancelButtonText}
            </button>
            <div className="flex items-center gap-4">
                {(type !== 'delete' && resetButton) &&
                    <button
                        type="reset"
                        form={formId}
                        className={`px-4 py-2 cursor-pointer text-sm font-medium ${bgResetButton} active:shadow-sm transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 active:opacity-70`}
                    >
                        Reset
                    </button>
                }
                <button
                    type={type === 'submit' ? 'submit' : 'button'}
                    form={type === 'submit' ? formId : undefined}
                    onClick={() => actions[type]?.()}
                    className={customButtonStyle || `${type === 'delete' ? bgDeleteButton : bgSaveButton} px-4 py-2 cursor-pointer text-sm font-medium active:shadow-sm transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 active:opacity-70`}
                >
                    {confirmButtonText}
                </button>
            </div>
        </footer>
    );
};

export default ModalFooter;
