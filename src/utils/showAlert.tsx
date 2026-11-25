import { createRoot, type Root } from "react-dom/client";
import Alert, { type AlertProps } from "@/components/Alert";
import type { DaisyColor } from "@/utils/color";

export interface AlertOptions {
  title?: string;
  text?: string;
  html?: string;
  footer?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: DaisyColor;
  cancelButtonColor?: DaisyColor;
  timer?: number;
  timerProgressBar?: boolean;
  reverseButtons?: boolean;
  redirectUrl?: string;
  onClose?: () => void;
  verifyText?: string;

  input?: "text";
  inputPlaceholder?: string;
  inputValidator?: (value: string) => string | void;

  extraButtonPath?: string;
  extraButtonText?: string;
  extraButtonOnClick?: () => void;

  copyableText?: string;
  copyLabel?: string;
}

export function showAlert(options: AlertOptions): Promise<string | boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root: Root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      container.remove();
      options.onClose?.();
      if (options.redirectUrl) {
        window.location.href = options.redirectUrl;
      }
    };

    const props: AlertProps = {
      ...options,
      onResolve: (result) => {
        resolve(result);
        cleanup();
      },
    };

    root.render(<Alert {...props} />);
  });
}
