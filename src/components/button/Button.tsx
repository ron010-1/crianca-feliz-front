import "./style.css";

type ButtonProps = {
  label: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  label,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`button ${variant}`}
      disabled={disabled}
      onClick={onClick}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
    >
      {label}
    </button>
  );
}
