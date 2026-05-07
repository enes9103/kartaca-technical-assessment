"use client";

import { useEffect, useRef, useState } from "react";

type FilterSelectProps = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={rootRef} className="space-y-2 text-sm font-medium text-slate-600">
      <span>{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm font-normal text-slate-700"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={value ? "text-slate-700" : "text-slate-500"}>
            {value || placeholder}
          </span>
          <span className="text-xs text-slate-500">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen ? (
          <div className="absolute left-0 top-full z-30 mt-1 w-full overflow-hidden rounded-md border border-slate-300 bg-white shadow-lg">
            <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-slate-100 ${
                    value === "" ? "bg-slate-100 font-medium text-slate-800" : "text-slate-700"
                  }`}
                >
                  {placeholder}
                </button>
              </li>
              {options.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-slate-100 ${
                      value === option
                        ? "bg-blue-50 font-medium text-blue-700"
                        : "text-slate-700"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
