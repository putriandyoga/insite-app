import { useEffect, useState, useMemo } from "react";
import { createRoot, type Root } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
} from "lucide-react";
import { getButtonColorClass, type DaisyColor } from "@/utils/color";

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
  extraButtonPath?: string;
  extraButtonText?: string;
  extraButtonOnClick?: () => void;
}

interface AlertProps extends AlertOptions {
  onResolve: (result: boolean) => void;
}

const ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  question: HelpCircle,
} as const;

const Alert = ({
  onResolve,
  icon,
  timer,
  reverseButtons,
  confirmButtonColor = "primary",
  cancelButtonColor = "neutral",
  verifyText,
  ...options
}: AlertProps) => {
  const [progress, setProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  // Handle timer & progress bar
  useEffect(() => {
    if (!timer) return;
    let start: number | null = null;
    let rafId: number;

    const update = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      setProgress(Math.min((elapsed / timer) * 100, 100));
      if (elapsed < timer) {
        rafId = requestAnimationFrame(update);
      } else {
        handleClose(true);
      }
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [timer]);

  const handleClose = (result: boolean) => {
    setIsOpen(false);
    // Beri jeda sedikit agar animasi exit framer-motion sempat berjalan sebelum di-resolve
    setTimeout(() => {
      onResolve(result);
    }, 200);
  };

  const IconComponent = icon ? ICON_MAP[icon] : null;
  const confirmDisabled = verifyText ? inputValue !== verifyText : false;

  const buttons = useMemo(() => {
    const list = [];

    if (options.showCancelButton) {
      list.push(
        <button
          key="cancel"
          className={`px-6 py-2 rounded-lg text-white shadow-sm transition-transform duration-150 hover:scale-105 ${getButtonColorClass(
            cancelButtonColor,
          )}`}
          onClick={() => handleClose(false)}
        >
          {options.cancelButtonText || "Cancel"}
        </button>,
      );
    }

    if (options.extraButtonPath && options.extraButtonText) {
      list.push(
        <button
          key="extra-path"
          className={`px-6 py-2 rounded-lg text-base-content shadow-sm transition-transform duration-150 hover:scale-105 ${getButtonColorClass(
            "warning",
          )}`}
          onClick={() => {
            const link = document.createElement("a");
            link.href = options.extraButtonPath!;
            link.download =
              options.extraButtonPath?.split("/").pop() || "file.xlsx";
            link.click();
          }}
        >
          {options.extraButtonText}
        </button>,
      );
    }

    if (options.extraButtonOnClick && options.extraButtonText) {
      list.push(
        <button
          key="extra-click"
          className={`px-6 py-2 rounded-lg text-base-content shadow-sm transition-transform duration-150 hover:scale-105 ${getButtonColorClass(
            "warning",
          )}`}
          onClick={() => {
            options.extraButtonOnClick?.();
          }}
        >
          {options.extraButtonText}
        </button>,
      );
    }

    if (options.showConfirmButton) {
      list.push(
        <button
          key="confirm"
          className={`px-6 py-2 rounded-lg text-white shadow-sm transition-transform duration-150 hover:scale-105 ${getButtonColorClass(
            confirmButtonColor,
          )} ${confirmDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={confirmDisabled}
          onClick={() => handleClose(true)}
        >
          {options.confirmButtonText || "OK"}
        </button>,
      );
    }

    return reverseButtons ? list.reverse() : list;
  }, [
    options,
    confirmButtonColor,
    cancelButtonColor,
    confirmDisabled,
    reverseButtons,
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-base-100 rounded-2xl shadow-xl w-100 max-w-full p-6 relative"
          >
            {IconComponent && (
              <div className="text-center mb-3 text-base-content">
                <IconComponent className="mx-auto" size={40} />
              </div>
            )}

            {options.title && (
              <h3 className="text-lg font-semibold text-center mb-2">
                {options.title}
              </h3>
            )}
            {options.text && (
              <p className="text-center text-base-content mb-4">
                {options.text}
              </p>
            )}
            {options.html && (
              <div
                className="text-center text-base-content mb-4"
                dangerouslySetInnerHTML={{ __html: options.html }}
              />
            )}
            {verifyText && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ketik "${verifyText}" untuk konfirmasi`}
                className="w-full mb-4 p-2 border rounded-lg text-base-content"
              />
            )}
            {options.footer && (
              <p className="text-center text-base-content text-sm mb-4">
                {options.footer}
              </p>
            )}

            {timer && options.timerProgressBar && (
              <div className="h-1 w-full bg-base-200 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="flex justify-center space-x-4">{buttons}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function showAlert(options: AlertOptions): Promise<boolean> {
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

    root.render(
      <Alert
        {...options}
        onResolve={(result) => {
          resolve(result);
          cleanup();
        }}
      />,
    );
  });
}
