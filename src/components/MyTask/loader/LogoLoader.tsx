import { ComponentType, SVGProps } from "react";

interface LogoLoaderProps {
    sizeContainer?: string;
    Logo?: ComponentType<SVGProps<SVGSVGElement>>;
    spinnerColor?: string;
}

const LogoLoader = ({ sizeContainer, Logo, spinnerColor }: LogoLoaderProps) => {
    return (
        <div className={`relative ${sizeContainer ?? 'h-60 w-60'}`}>
            <svg className="absolute inset-0 w-full h-full animate-spin-slow z-10" viewBox="0 0 100 100">
                <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke={spinnerColor || "#60A5FA"} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray="280" strokeDashoffset="210"
                />
            </svg>
            <figure className="h-full w-full rounded-full overflow-hidden relative">
                {Logo && <Logo className="h-full w-full" />}
            </figure>
        </div>
    );
};

export default LogoLoader;
