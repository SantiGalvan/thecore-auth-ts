import { sileo } from "sileo";

const useToast = () => {
    const success = (title: string, description?: string) => sileo.success({ title, description });
    const error = (title: string, description?: string) => sileo.error({ title, description });
    const info = (title: string, description?: string) => sileo.info({ title, description });
    const warning = (title: string, description?: string) => sileo.warning({ title, description });
    const promise = (p: Promise<unknown>, messages: Record<string, unknown>) => sileo.promise(p, messages as Record<string, string>);

    return { success, error, info, warning, promise };
};

export { useToast };
