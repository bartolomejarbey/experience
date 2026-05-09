"use client";

import clsx from "clsx";
import { useId } from "react";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  defaultValue?: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
};

export function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
  error,
  defaultValue,
  hint,
  multiline = false,
  rows = 4,
}: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedByParts = [error ? errorId : null, hint && !error ? hintId : null].filter(
    Boolean,
  );
  const describedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

  const inputClass = clsx(
    "rounded-control font-body bg-cream text-ink placeholder:text-ink-muted/70 w-full",
    "border-brown/20 focus-visible:border-terracotta border px-4 py-3 transition-colors focus-visible:outline-none",
    error && "border-terracotta",
  );

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-ink-muted text-sm">
        {label}
        {required && (
          <span aria-hidden="true" className="text-terracotta">
            {" "}
            *
          </span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          rows={rows}
          aria-required={required || undefined}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={clsx(inputClass, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          aria-required={required || undefined}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={inputClass}
        />
      )}

      {hint && !error && (
        <p id={hintId} className="text-ink-muted text-xs">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-terracotta text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
