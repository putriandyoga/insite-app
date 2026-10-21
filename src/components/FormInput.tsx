import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Eye, EyeOff, type LucideIcon } from "lucide-react";
import type { ChangeEvent } from "react";

type SelectOption =
  | string
  | { label: string; value: string | number | boolean }
  | { label: string; options: { label: string; value: string | number }[] };

type RadioOption = {
  label: string;
  value: string;
};

type FormInputProps = {
  label: string;
  value?: any;

  onChange?: (value: any) => void;
  required?: boolean;
  placeholder?: string;
  type?:
    | "text"
    | "number"
    | "date"
    | "time"
    | "email"
    | "password"
    | "textarea"
    | "tel"
    | "radio"
    | "checkbox"
    | "switch"
    | "file";
  options?: SelectOption[];
  radioOptions?: RadioOption[];
  min?: number | string;
  max?: number | string;
  pattern?: string;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: LucideIcon;
  className?: string;
  helpText?: string;
  rows?: number;
  dropdownType?: "search" | "select";
  searchable?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
};

const FormInput = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = "",
  type = "text",
  options,
  radioOptions,
  min,
  max,
  pattern,
  disabled = false,
  readOnly = false,
  icon: Icon,
  className = "",
  helpText,
  rows = 4,
  dropdownType,
  disablePast = false,
  disableFuture = false,
}: FormInputProps) => {
  const normalizeOptions = () => {
    if (!options) return [];

    return options.flatMap((opt) => {
      if (typeof opt === "string") return [{ label: opt, value: opt }];

      if ("value" in opt)
        return [{ label: opt.label, value: String(opt.value) }];

      if ("options" in opt)
        return opt.options.map((o) => ({
          label: o.label,
          value: String(o.value),
        }));

      return [];
    });
  };

  const normalizedOptions = normalizeOptions();

  const [selectOpen, setSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredSelectOptions = searchText
    ? normalizedOptions.filter((o) =>
        o.label.toLowerCase().includes(searchText.toLowerCase()),
      )
    : normalizedOptions;

  const baseClasses =
    "w-full px-4 py-2.5 border border-base-300 rounded-lg text-body" +
    (readOnly
      ? " bg-base-200 cursor-not-allowed"
      : " bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent");

  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const flattenOptions = (): string[] => {
    if (!options) return [];
    let list: string[] = [];

    options.forEach((opt) => {
      if (typeof opt === "string") list.push(opt);
      else if ("value" in opt) list.push(opt.label);
      else if ("options" in opt) opt.options.forEach((o) => list.push(o.label));
    });

    return list;
  };

  const flatOptions = flattenOptions();
  const filtered = flatOptions.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase()),
  );
  if (type === "switch") {
    const isOn = value === true || value === "1" || value === 1;

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(!isOn)}
          className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${isOn ? "bg-primary" : "bg-base-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        >
          <span
            className={`
            inline-block h-4 w-4 transform rounded-full bg-base-100 transition-transform
            ${isOn ? "translate-x-6" : "translate-x-1"}
          `}
          />
        </button>

        {label && (
          <span className="text-body text-base-content select-none">
            {label}
          </span>
        )}
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div className={`relative ${className}`}>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange?.(e.target.checked)}
              required={required}
              disabled={disabled}
              className={`
                peer appearance-none w-5 h-5 rounded-md border-2 cursor-pointer
                transition-all duration-200 ease-in-out
                ${
                  value
                    ? "bg-primary border-primary"
                    : "bg-base-100 border-base-300 hover:border-primary/50"
                }
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-base-300
              `}
            />
            <Check
              className={`
                absolute w-4 h-4 text-white pointer-events-none
                transition-all duration-200 ease-in-out
                ${value ? "opacity-100 scale-100" : "opacity-0 scale-50"}
              `}
              strokeWidth={3}
            />
          </div>
          <span className="text-body font-medium text-base-content group-hover:text-primary transition-colors select-none">
            {label} {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
        {helpText && (
          <p className="text-xs text-base-content/70 mt-2 ml-8">{helpText}</p>
        )}
      </div>
    );
  }

  if (type === "date") {
    const today = new Date();
    let minDate: string | undefined = min ? String(min) : undefined;
    let maxDate: string | undefined = max ? String(max) : undefined;

    if (disablePast) {
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      minDate = `${y}-${m}-${d}`;
    }

    if (disableFuture) {
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, "0");
      const d = String(today.getDate()).padStart(2, "0");
      maxDate = `${y}-${m}-${d}`;
    }

    return (
      <div className={`relative ${className} space-y-2`}>
        <label className="block text-body font-medium text-base-content mb-2">
          {label} {required && <span className="text-error">*</span>}
        </label>
        <input
          type="date"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange?.(e.target.value)
          }
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          min={minDate}
          max={maxDate}
          className={baseClasses}
        />
        {helpText && <p className="text-xs text-base-content/80">{helpText}</p>}
      </div>
    );
  }
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setSelectOpen(false);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={`relative ${className} space-y-2`}>
      <label className="block text-body font-medium text-base-content mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>

      {type === "radio" && radioOptions ? (
        <div className="flex flex-col gap-2">
          {radioOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange?.(opt.value)}
                required={required}
                disabled={disabled}
                className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-body text-base-content">{opt.label}</span>
            </label>
          ))}
        </div>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onChange?.(e.target.value)
          }
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          className={baseClasses + " resize-y"}
        />
      ) : type === "password" ? (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange?.(e.target.value)
            }
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            min={min}
            max={max}
            pattern={pattern}
            className={
              Icon ? `pl-10 pr-10 ${baseClasses}` : `pr-10 ${baseClasses}`
            }
          />
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content">
              <Icon />
            </span>
          )}
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-base-content/50"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
      ) : type === "file" ? (
        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            onChange?.(file);
          }}
          required={required}
          disabled={disabled}
          className={baseClasses}
        />
      ) : options ? (
        dropdownType === "select" ? (
          <div ref={selectRef} className="relative text-body">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setSelectOpen((v) => !v)}
              className={`
        ${baseClasses}
        flex justify-between items-center
        cursor-pointer
      `}
            >
              <span className={!value ? "text-base-content/50" : ""}>
                {value !== undefined && value !== null && value !== ""
                  ? normalizedOptions.find((o) => o.value === String(value))
                      ?.label ||
                    placeholder ||
                    `Pilih ${label}`
                  : placeholder || `Pilih ${label}`}
              </span>
              <ChevronDown className="w-4 h-4 text-base-content" />
            </button>

            {selectOpen && (
              <div className="absolute z-99 mt-2 p-2 w-full bg-base-100 border border-base-300 rounded-lg shadow-md flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="
                    w-full px-3 py-2 bg-base-100 text-base-content border-b border-base-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />

                <ul className="max-h-60 overflow-auto flex flex-col gap-1">
                  {/* Opsi untuk mengosongkan pilihan */}
                  <li
                    onMouseDown={() => {
                      onChange?.("");
                      setSelectOpen(false);
                      setSearchText("");
                    }}
                    className="px-3 py-2 rounded-md cursor-pointer text-base-content/60 hover:bg-base-200 italic border-b border-base-300/50 mb-1"
                  >
                    Empty Value
                  </li>

                  {filteredSelectOptions.length > 0 ? (
                    filteredSelectOptions.map((opt) => (
                      <li
                        key={opt.value}
                        onMouseDown={() => {
                          onChange?.(opt.value);
                          setSelectOpen(false);
                          setSearchText("");
                        }}
                        className={`px-3 py-2 rounded-md cursor-pointer text-base-content hover:bg-base-200
                  ${
                    String(value) === opt.value
                      ? "bg-primary/30 font-semibold"
                      : ""
                  }
                `}
                      >
                        {opt.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-base-content/60">
                      Tidak ada data
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          /* --- SEARCHABLE DROPDOWN (existing) --- */
          <div ref={selectRef} className="relative">
            <input
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                onChange?.(val);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder={placeholder || `Pilih atau ketik ${label}`}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              className={baseClasses}
            />

            {open && (
              <div className="absolute mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-2xl z-99 max-h-48 overflow-auto">
                {filtered.length > 0 ? (
                  filtered.map((item, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 cursor-pointer hover:bg-base-200"
                      onMouseDown={() => {
                        setQuery(item);
                        onChange?.(item);
                        setOpen(false);
                      }}
                    >
                      {item}
                    </div>
                  ))
                ) : query !== "" ? (
                  <div className="px-4 py-2 text-base-content/70">
                    Ketik manual: <strong>{query}</strong>
                  </div>
                ) : (
                  <div className="px-4 py-2 text-base-content/70">
                    Tidak ada data
                  </div>
                )}
              </div>
            )}
          </div>
        )
      ) : (
        <div ref={selectRef} className="relative">
          {Icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content">
              <Icon />
            </span>
          )}
          <input
            type={type}
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange?.(e.target.value)
            }
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            min={min}
            max={max}
            pattern={pattern}
            className={Icon ? `pl-10 ${baseClasses}` : baseClasses}
          />
        </div>
      )}

      {helpText && <p className="text-xs text-base-content/80">{helpText}</p>}
    </div>
  );
};

export default FormInput;
