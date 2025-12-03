import "./style.css";

type SizeProps = "sm" | "md" | "lg";

interface LoadingProps {
  message?: string;
  size?: SizeProps;
}

const Loading = ({ message, size = "md" }: LoadingProps) => {
  const loaderClassName = `loader loader-${size}`;

  return (
    <div className="loader-container">
      <div className={loaderClassName}></div>
      <span className={`message-${size}`}>{message || "carregando..."}</span>
    </div>
  );
};

export default Loading;
