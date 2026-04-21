import { ReactNode, ReactElement } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Login from "../pages/login/Login";
import AuthPage from "../middlewares/auth/AuthPage";
import Dashboard from "../pages/user/Dashboard";
import Logo from '../assets/MyWarehouse.svg?react';
import React, { useEffect, useMemo, ComponentType, SVGProps } from "react";
import { useRoutesInjection } from "../contexts/route/RouteContext";
import { useConfig } from "../contexts/config/ConfigContext";
import { UsePageTitle } from "../hooks/title/UsePageTitle";

interface PackageRoutesProps {
    logoImg?: ComponentType<SVGProps<SVGSVGElement>>;
    pathImg?: string;
    firstPrivateElement?: ReactNode;
    globalLayout?: ReactElement | "none" | null;
    isMain?: boolean;
    headerComponent?: ReactNode;
    showHeaderOnLogin?: boolean;
    headerExcludedRoutes?: string[];
    footerComponent?: ReactNode;
    showFooterOnLogin?: boolean;
    footerExcludedRoutes?: string[];
    privateProvider?: ReactElement;
    customProvider?: ReactElement;
    promptComponent?: ReactNode;
}

const PackageRoutes = (props: PackageRoutesProps) => {
    const { publicRoutes, privateRoutes } = useRoutesInjection();
    const { firstPrivatePath, routes, defaultTitle } = useConfig();
    UsePageTitle(routes, defaultTitle);

    const {
        logoImg = Logo,
        pathImg = './src/assets/MyWarehouse.svg',
        firstPrivateElement = <Dashboard />,
        globalLayout,
        isMain,
        headerComponent,
        showHeaderOnLogin,
        headerExcludedRoutes,
        footerComponent,
        showFooterOnLogin,
        footerExcludedRoutes,
        privateProvider,
        customProvider,
        promptComponent
    } = props;

    let layout: ReactElement | null;

    if (globalLayout === "none") {
        layout = null;
    } else if (React.isValidElement(globalLayout)) {
        layout = globalLayout;
    } else {
        layout = (
            <DefaultLayout
                isMain={isMain}
                headerComponent={headerComponent}
                showHeaderOnLogin={showHeaderOnLogin}
                headerExcludedRoutes={headerExcludedRoutes}
                footerComponent={footerComponent}
                showFooterOnLogin={showFooterOnLogin}
                footerExcludedRoutes={footerExcludedRoutes}
                promptComponent={promptComponent}
            />
        );
    }

    const providerElement = useMemo(() => {
        const authOutlet = <AuthPage><Outlet /></AuthPage>;
        if (privateProvider) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const inner = customProvider
                ? React.cloneElement(customProvider as any, {}, authOutlet)
                : authOutlet;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return React.cloneElement(privateProvider as any, {}, inner);
        }
        if (customProvider) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return React.cloneElement(customProvider as any, {}, authOutlet);
        }
        return authOutlet;
    }, [privateProvider, customProvider]);

    const iconUpdater = () => {
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
        if (pathImg && favicon) favicon.href = pathImg;
    };

    useEffect(() => { iconUpdater(); }, []);

    return (
        <Routes>
            <Route element={layout}>
                <Route path="/">
                    <Route index element={<Login Logo={logoImg} />} />
                    {publicRoutes.map((route, i) => (
                        <Route key={`public-${i}`} path={route.path} element={route.element} />
                    ))}
                </Route>
                <Route element={providerElement}>
                    <Route path={`${firstPrivatePath ?? '/dashboard/'}:id`} element={firstPrivateElement} />
                    {privateRoutes.map((route, i) => (
                        <Route key={`private-${i}`} path={route.path} element={route.element} />
                    ))}
                </Route>
            </Route>
        </Routes>
    );
};

export default PackageRoutes;
