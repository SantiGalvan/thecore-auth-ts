import { ReactNode } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/loading/Loading";
import { useLoading } from "../contexts/loading/LoadingContext";
import { useAlert } from "../contexts/alert/AlertContext";
import Alert from "../components/alert/Alert";
import Modal from "../components/modal/Modal";
import { useModal } from "../contexts/modal/ModalContext";
import { Toaster } from "sileo";
import { useConfig } from "../contexts/config/ConfigContext";

interface DefaultLayoutProps {
    isMain?: boolean;
    headerComponent?: ReactNode;
    showHeaderOnLogin?: boolean;
    headerExcludedRoutes?: string[];
    footerComponent?: ReactNode;
    showFooterOnLogin?: boolean;
    footerExcludedRoutes?: string[];
    promptComponent?: ReactNode;
}

const DefaultLayout = ({
    isMain = true, headerComponent = null, showHeaderOnLogin = false,
    headerExcludedRoutes = [], footerComponent = null, showFooterOnLogin = false,
    footerExcludedRoutes = [], promptComponent = null,
}: DefaultLayoutProps) => {
    const { isLoading } = useLoading();
    const { showAlert } = useAlert();
    const { sileoToastConfig, pwa } = useConfig();
    const { isOpen, closeModal, onCancel, content, title, onConfirm, item, type, formId, style, headerContent, footerContent } = useModal();
    const location = useLocation();

    const defaultOptions = {
        fill: "#000000", duration: 2000,
        styles: { title: "text-white font-semibold", description: "text-white/75", badge: "bg-white/20" }
    };
    const toastPosition = sileoToastConfig?.position;
    const toastOptions = sileoToastConfig?.options || defaultOptions;

    const isExcluded = headerExcludedRoutes.some(path => matchPath(path, location.pathname));
    let showHeader: ReactNode | boolean;
    if (location.pathname === "/") {
        showHeader = headerComponent && showHeaderOnLogin;
    } else {
        showHeader = headerComponent && !isExcluded;
    }

    const footerIsExcluded = footerExcludedRoutes.some(path => matchPath(path, location.pathname));
    let showFooter: ReactNode | boolean;
    if (location.pathname === '/') {
        showFooter = footerComponent && showFooterOnLogin;
    } else {
        showFooter = footerComponent && !footerIsExcluded;
    }

    return (
        <>
            {pwa?.customPrompt && promptComponent}
            {isLoading && <Loading />}
            {showAlert && <Alert />}
            <Toaster position={toastPosition || "bottom-right"} options={toastOptions} />
            <Modal
                isOpen={isOpen} onClose={closeModal} onCancel={onCancel}
                title={title} formId={formId} onConfirm={onConfirm}
                type={type} item={item} style={style}
                headerContent={headerContent} footerContent={footerContent}
            >
                {content}
            </Modal>
            {showHeader && headerComponent}
            {isMain ?
                <main className={isLoading ? 'hidden' : ''}>
                    {showAlert && <Alert />}
                    <Outlet />
                </main>
                :
                <Outlet />
            }
            {showFooter && footerComponent}
        </>
    );
};

export default DefaultLayout;
