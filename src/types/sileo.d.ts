declare module 'sileo' {
  interface ToastOptions { title: string; description?: string; }
  interface SileoToaster {
    success(o: ToastOptions): void;
    error(o: ToastOptions): void;
    info(o: ToastOptions): void;
    warning(o: ToastOptions): void;
    promise(p: Promise<unknown>, m: Record<string, unknown>): void;
  }
  export const sileo: SileoToaster;
  export function Toaster(props: { position?: string; options?: Record<string, unknown> }): JSX.Element;
}
