import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
} from "lucide-react";
import { getButtonColorClass } from "@/utils/color";
import { CopyButton } from "@/components/CopyButton";
import type { AlertOptions } from "@/utils/showAlert";

export interface AlertProps extends AlertOptions {
  onResolve: (result: boolean | string) => void;
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
  input,
  inputPlaceholder,
  inputValidator,
  copyableText,
  copyLabel = "Copy",
  ...options
}: AlertProps) => {
  const [progress, setProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(
    (result: boolean) => {
      if (result && input === "text") {
        if (inputValidator) {
          const error = inputValidator(inputValue);
          if (error) {
            setInputError(error);
            return;
          }
        }
      }

      setIsOpen(false);
      setTimeout(() => {
        if (result && input === "text") {
          onResolve(inputValue);
        } else {
          onResolve(result);
        }
      }, 200);
    },
    [input, inputValidator, inputValue, onResolve],
  );

  const handleCloseRef = useRef(handleClose);
  useEffect(() => {
    handleCloseRef.current = handleClose;
  }, [handleClose]);

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
        handleCloseRef.current(true);
      }
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [timer]);

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
    handleClose,
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

            {copyableText && (
              <div className="flex items-center justify-between bg-base-200/70 border border-base-300 px-4 py-2.5 rounded-xl mb-4">
                <span className="font-mono font-bold text-base tracking-wider text-primary select-all">
                  {copyableText}
                </span>
                <CopyButton text={copyableText} label={copyLabel} />
              </div>
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

            {input === "text" && (
              <div className="mb-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder={inputPlaceholder || "Masukkan teks..."}
                  className="w-full p-2.5 border rounded-lg text-base-content bg-base-200/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {inputError && (
                  <span className="text-xs text-error mt-1 block">
                    {inputError}
                  </span>
                )}
              </div>
            )}

            <div className="flex justify-center space-x-4">{buttons}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
