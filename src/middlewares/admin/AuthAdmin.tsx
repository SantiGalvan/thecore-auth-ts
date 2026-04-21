import { Navigate, useLocation } from "react-router-dom";
import { useAlert } from "../../contexts/alert/AlertContext";
import { useEffect, ReactNode } from "react";
import { useAuthStorage } from "../../hooks/auth/useAuthStorage";

interface AuthAdminProps {
    children: ReactNode;
}

const AuthAdmin = ({ children }: AuthAdminProps) => {
    const { user } = useAuthStorage();
    const location = useLocation();
    const { activeAlert } = useAlert();

    useEffect(() => {
        if (!user || !user.admin) activeAlert('warning', 'Non puoi accedere a questa pagina');
    }, [user]);

    if (!user || !user.admin) return <Navigate to={(location.state as { from?: string })?.from || '/'} replace />;

    return <>{children}</>;
};

export default AuthAdmin;
