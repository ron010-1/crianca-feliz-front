import "./style.css";

type SizeProps = "sm" | "md" | "lg";

interface LoadingProps {
  message?: string;
  size?: SizeProps;
  withMessage?: boolean;
}

const Loading = ({ message, size = "md", withMessage = true }: LoadingProps) => {
  const loaderClassName = `loader loader-${size}`;

  return (
    <div className={`loader-container ${size}`}>
      <div className={loaderClassName}></div>
      {withMessage && <span className={`message-${size}`}>{message || "carregando..."}</span>}
    </div>
  );
};

export default Loading;
