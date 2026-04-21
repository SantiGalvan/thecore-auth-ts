import { useLayoutEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";

interface RouteTitle {
    path: string;
    title: string;
}

const UsePageTitle = (routes: RouteTitle[] = [], defaultTitle = "SPOT"): void => {
    const location = useLocation();

    useLayoutEffect(() => {
        let matchedTitle = defaultTitle;
        for (const route of routes) {
            if (matchPath({ path: route.path, end: true }, location.pathname)) {
                matchedTitle = route.title;
                break;
            }
        }
        document.title = matchedTitle;
    }, [location, routes, defaultTitle]);
};

export { UsePageTitle };
