import style from './Input.module.css';

type InputProps = {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  type?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: InputProps) {
  return (
    <input
      className={style.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
    />
  );
}
