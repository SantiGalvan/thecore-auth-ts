import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import './css/loader.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import { ConfigProvider } from './contexts/config/ConfigContext';
import { LoadingProvider } from './contexts/loading/LoadingContext';
import { AlertProvider } from './contexts/alert/AlertContext';
import { LoginFormProvider } from './contexts/login/LoginFormContext';
import { ModalProvider } from './contexts/modal/ModalContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <LoadingProvider>
                <ConfigProvider>
                    <AlertProvider>
                        <AuthProvider>
                            <LoginFormProvider>
                                <ModalProvider>
                                    <App />
                                </ModalProvider>
                            </LoginFormProvider>
                        </AuthProvider>
                    </AlertProvider>
                </ConfigProvider>
            </LoadingProvider>
        </BrowserRouter>
    </StrictMode>,
);
