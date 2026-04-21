import { useRef, ChangeEventHandler } from "react";

interface ConfigFileRiderAllBrowserProps {
    show?: boolean;
    isConfigPage?: boolean;
    handleFileChange: ChangeEventHandler<HTMLInputElement>;
}

const ConfigFileRiderAllBrowser = ({ show, isConfigPage, handleFileChange }: ConfigFileRiderAllBrowserProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`${isConfigPage ? `${show ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-10"}` : ''} p-4 text-center transition-all duration-700 transform`}>
            <h2 className="text-xl my-4">Seleziona il file <strong>config.json</strong> per recuperare le chiavi univoche del dispositivo</h2>
            <div>
                <input
                    type="file" accept=".json" ref={fileInputRef}
                    style={{ display: "none" }} onChange={handleFileChange}
                />
                <button
                    onClick={handleSelectFile}
                    className="my-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                    Seleziona file
                </button>
            </div>
        </div>
    );
};

export default ConfigFileRiderAllBrowser;
