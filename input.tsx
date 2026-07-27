import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-paper placeholder:text-fog/60 outline-none transition focus:border-beacon",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
