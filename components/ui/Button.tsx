"use client";

import clsx from "clsx";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "ghost" | "icon";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-disabled={disabled || isLoading || undefined}
      className={clsx(
        "rounded-control font-body inline-flex items-center justify-center gap-2 transition-colors",
        "focus-visible:ring-terracotta focus-visible:ring-offset-cream focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant !== "icon" && size === "sm" && "h-9 px-4 text-sm",
        variant !== "icon" && size === "md" && "h-11 px-6 text-base",
        variant !== "icon" && size === "lg" && "h-12 px-8 text-base font-medium",
        variant === "primary" && "bg-terracotta text-cream hover:bg-terracotta-soft active:bg-brown",
        variant === "ghost" && "border-brown/20 text-ink hover:bg-ink/5 border bg-transparent",
        variant === "icon" && "text-ink hover:bg-ink/5 h-11 w-11 rounded-full bg-transparent p-0",
        className,
      )}
      {...rest}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
});

function Spinner() {
  return (
    <svg className="animate-spin" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
