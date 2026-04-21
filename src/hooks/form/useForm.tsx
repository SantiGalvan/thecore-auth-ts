import { useState } from "react";

interface FormFiles { [field: string]: File[] }
interface FormPreviews { [field: string]: string[] }

const useForm = <T extends Record<string, unknown>>(initialValues: T = {} as T) => {
    const [values, setValues] = useState<T>(initialValues);
    const [files, setFiles] = useState<FormFiles>({});
    const [previews, setPreviews] = useState<FormPreviews>({});

    const handleChange = (field: string, value: unknown) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const addFiles = (field: string, fileList: FileList | File[]) => {
        const fileArray = Array.from(fileList);
        setFiles(prev => ({ ...prev, [field]: [...(prev[field] || []), ...fileArray] }));
        const previewUrls = fileArray.map(file => URL.createObjectURL(file));
        setPreviews(prev => ({ ...prev, [field]: [...(prev[field] || []), ...previewUrls] }));
    };

    const replaceFiles = (field: string, fileList: FileList | File[]) => {
        const fileArray = Array.from(fileList);
        setFiles(prev => ({ ...prev, [field]: fileArray }));
        const previewUrls = fileArray.map(file => URL.createObjectURL(file));
        setPreviews(prev => ({ ...prev, [field]: previewUrls }));
    };

    const removeFile = (field: string, index: number) => {
        setFiles(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
        setPreviews(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const resetForm = () => {
        setValues(initialValues);
        setFiles({});
        setPreviews({});
    };

    return { values, handleChange, files, previews, addFiles, replaceFiles, removeFile, setValues, resetForm };
};

export { useForm };
