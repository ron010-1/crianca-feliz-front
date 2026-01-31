import { forwardRef } from "react";
import type { ChangeEvent } from "react";
import Style from "./Input.module.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  tamanho?: "sm" | "md" | "lg";
  onValueChange?: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, tamanho = "md", onValueChange, className, onChange, ...props }, ref) => {
    const sizeClass = tamanho === "sm" ? Style.sm : tamanho === "lg" ? Style.lg : Style.md;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <div className={Style.container}>
        {label ? <label className={Style.label}>{label}</label> : null}
        <input
          ref={ref}
          {...props}
          className={[Style.input, sizeClass, className].filter(Boolean).join(" ")}
          onChange={handleChange}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
