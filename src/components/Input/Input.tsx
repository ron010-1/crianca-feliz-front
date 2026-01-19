import { useId, type InputHTMLAttributes } from "react";
import style from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  tamanho?: "md" | "lg";
}

export default function Input({ label, type = "text", tamanho = "md", className, ...props }: InputProps) {
  const inputId = useId();

  return (
    <div className={style.wrapper}>
      {label && (
        <label className={style.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={`${style.input} ${style[tamanho]} ${className || ""}`} type={type} {...props} />
    </div>
  );
}
